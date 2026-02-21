import requests
import os
from dotenv import load_dotenv

load_dotenv()

MAD_api_token = os.getenv("MAD_API_TOKEN")
headers = {"Authorization": f"Token token={MAD_api_token}"}

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

data = get_grade_data("COMP SCI 300")
grades_url = data['gradesUrl']
#print(grades_url)
grades_response = requests.get(grades_url, headers=headers).json()
#print(grades_response)
cumulative = grades_response.get('cumulative', {})
#print(cumulative)
avg_gpa = cumulative.get('gpa')
#print(avg_gpa)

def get_stress_metrics(stats):
    total = stats['total']
    if total == 0: return 0
    
    a_rate = (stats['aCount'] / total) * 100
    fail_rate = ((stats['fCount'] + stats['dCount']) / total) * 100
    
    return round(a_rate, 2), round(fail_rate, 2)

# Instructor-specific Stats
for offering in grades_response.get('courseOfferings', []):
    for section in offering.get('sections', []):
        for instructor in section.get('instructors', []):
            name = instructor['name']
            
            # 1. Get MadGrades stress (from your previous logic)
            a_rate, fail_rate = get_stress_metrics(section)
            print(f"{name} | A%: {a_rate}% | Fail%: {fail_rate}%")