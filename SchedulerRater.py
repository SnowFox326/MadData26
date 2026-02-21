import requests
import os
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from dotenv import load_dotenv

load_dotenv()

MAD_api_token = os.getenv("MAD_API_TOKEN")
headers = {"Authorization": f"Token token={MAD_api_token}"}

# Key: semester code, value: semester description
code_to_semester = {1262: "Fall 2025", 1254: "Spring 2025", 1252: "Fall 2024", 1244: "Spring 2024", 
                  1242: "Fall 2023", 1234: "Spring 2023", 1232: "Fall 2022", 1224: "Spring 2022", 
                  1222: "Fall 2021", 1212: "Fall 2020", 1204: "Spring 2020", 1202: "Fall 2019", 
                  1194: "Spring 2019", 1192: "Fall 2018", 1184: "Spring 2018", 1182: "Fall 2017"}
semester_to_code = {"Fall 2025": 1262, "Spring 2025": 1254, "Fall 2024": 1252, "Spring 2024": 1244, 
                  "Fall 2023": 1242, "Spring 2023": 1234, "Fall 2022": 1232, "Spring 2022": 1224, 
                  "Fall 2021": 1222, "Fall 2020": 1212, "Spring 2020": 1204, "Fall 2019": 1202, 
                  "Spring 2019": 1194, "Fall 2018": 1192, "Spring 2018": 1184, "Fall 2017": 1182}
semester_remove_upper = {"FALL 2025": "Fall 2025", "SPRING 2025": "Spring 2025", "FALL 2024": "Fall 2024", 
                        "SPRING 2024": "Spring 2024", "FALL 2023": "Fall 2023", "SPRING 2023": "Spring 2023", 
                        "FALL 2022": "Fall 2022", "SPRING 2022": "Spring 2022", "FALL 2021": "Fall 2021", 
                        "FALL 2020": "Fall 2020", "SPRING 2020": "Spring 2020", "FALL 2019": "Fall 2019", 
                        "SPRING 2019": "Spring 2019", "FALL 2018": "Fall 2018", "SPRING 2018": "Spring 2018", 
                        "FALl 2017": "Fall 2017"}

def get_grade_data(course_name):
    # Search for the course (e.g., "COMP SCI 300")
    url = f"https://api.madgrades.com/v1/courses?query={course_name}"
    response = requests.get(url, headers=headers).json()
    
    if response['results']:
        # Get the unique UUID for the first matching course
        course_uuid = response['results'][0]['uuid']
        # Fetch detailed distribution
        detail_url = f"https://api.madgrades.com/v1/courses/{course_uuid}"
        return requests.get(detail_url, headers=headers).json()
    return None

def get_average_gpa(class_grades):
    gpa_values = {'aCount': 4, 'abCount': 3.5, 'bCount': 3, 'bcCount': 2.5, 'cCount': 2, 'dCount': 1, 'fCount': 0}
    sum = 0
    total = 0
    for key in gpa_values.keys():
        sum += class_grades.get(key) * gpa_values[key]
        total += class_grades.get(key)
    return round(sum / total, 2)


def get_stress_metrics(stats):
    total = stats['total']
    if total == 0: return 0
    
    a_rate = (stats['aCount'] / total) * 100
    fail_rate = ((stats['fCount'] + stats['dCount']) / total) * 100
    
    return round(a_rate, 2), round(fail_rate, 2)

def print_cumulative_stats(grades_response):
    cumulative = grades_response.get('cumulative', {})
    #print(cumulative)
    avg_gpa = get_average_gpa(cumulative)
    #print(avg_gpa)

    a_rate, fail_rate = get_stress_metrics(cumulative)
    print(f"Cumulative | A%: {a_rate}% | Fail%: {fail_rate}% | Average GPA: {avg_gpa}")

    return a_rate, fail_rate

def print_stats_by_instructor(grades_response, instructor_name):
    instructor_name = instructor_name.strip().upper()
    for offering in grades_response.get('courseOfferings', []):
        #print(offering)
        semester = code_to_semester[offering.get('termCode')]
        for section in offering.get('sections', []):
            #print(section)
            for instructor in section.get('instructors', []):
                if (instructor['name'] == instructor_name):
            
                    # 1. Get MadGrades stress (from your previous logic)
                    a_rate, fail_rate = get_stress_metrics(section)
                    gpa = get_average_gpa(section)
                    sec_number = section.get('sectionNumber')
                    print(f"{instructor_name} | Semester: {semester} | Section: {sec_number} | A%: {a_rate}% | Fail%: {fail_rate}% | Average GPA: {gpa}")

def print_stats_by_semester(grades_response, semester_code):
    semester = code_to_semester[semester_code]
    for offering in grades_response.get('courseOfferings', []):
        if (offering.get('termCode') == semester_code):
            stats = offering.get('cumulative')
            
            total = stats.get('total')
            if (total == 0) : return 0
            a_rate = (stats.get('aCount') / total) * 100
            fail_rate = ((stats.get('fCount') + stats.get('dCount')) / total) * 100
            a_rate = round(a_rate, 2)
            fail_rate = round(fail_rate, 2)
            gpa = get_average_gpa(stats)

            print(f"Semester: {semester} | A%: {a_rate}% | Fail%: {fail_rate}% | Average GPA: {gpa}")
        '''
        if (offering.get('termCode') != semester_code):
            continue
        semester = code_to_semester[semester_code]
        for section in offering.get('sections', []):
            for instructor in section.get('instructors', []):
                name = instructor['name']
            
                # 1. Get MadGrades stress (from your previous logic)
                a_rate, fail_rate = get_stress_metrics(section)
                sec_number = section.get('sectionNumber')
                print(f"{name} | Semester: {semester} | Section: {sec_number} | A%: {a_rate}% | Fail%: {fail_rate}%")
                '''

def calculate_score(class_codes, credits):
    if (len(credits) != len(class_codes)):
        raise Exception("List sizes don't match")
    difficulty = []
    for code in class_codes:
        data = get_grade_data(code)
        grades_url = data['gradesUrl']
        #print(grades_url)
        grades_response = requests.get(grades_url, headers=headers).json()
        avg_gpa = get_average_gpa(grades_response.get('cumulative', {}))
        #print(avg_gpa)
        diff_score = 100 - (100 * avg_gpa / 4.0)
        difficulty.append(diff_score)
        #print(diff_score)
    for i in range(len(difficulty)):
        difficulty[i] *= credits[i]
        #print(difficulty[i])
    final_score = sum(difficulty) / sum(credits)
    return round(final_score)

def create_graph(class_grades):
    gpa_values = {'aCount': 'A', 'abCount': 'AB', 'bCount': 'B', 'bcCount': 'BC', 'cCount': 'C', 'dCount': 'D', 'fCount': 'F'}
    categories = []
    values = []
    for key in gpa_values.keys():
        categories.append(gpa_values[key])
        values.append(class_grades.get(key))
    total = sum(values)
    for i in range(len(values)):
        values[i] = (values[i] / total) * 100
    fig, ax = plt.subplots(figsize=(10,5))
    sns.despine(ax = ax)
    bar_container = ax.bar(categories, values)
    ax.bar_label(bar_container, fmt = '{:,.1f}%')
    plt.xlabel("Grades")
    plt.ylabel("Percentage of students")
    plt.show()




def run_program():
    #create_graph()
    #print(calculate_score(["CS 300", "CS 400", "STAT 240", "MATH 234"], [3, 3, 3, 3]))
    class_code = input("Enter your class number: ")
    data = get_grade_data(class_code)
    grades_url = data['gradesUrl']
    #print(grades_url)
    grades_response = requests.get(grades_url, headers=headers).json()
    create_graph(grades_response.get('cumulative', {}))

    #print(grades_response)
    print_cumulative_stats(grades_response)
    semester = semester_remove_upper[input("Enter a semester (ex: Spring 2024):").strip().upper()]
    semester_code = semester_to_code[semester]
    print_stats_by_semester(grades_response, semester_code)

    professor = input("Enter a professor name: ")
    professor = professor.strip().upper()
    print_stats_by_instructor(grades_response, professor)

run_program()
