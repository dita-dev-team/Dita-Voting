import csv
import random

from mongoengine import connect
from mongoengine.connection import get_connection
from mongoengine import Document, StringField, IntField, BooleanField

class Student(Document):
	fullname = StringField(required=True)
	student_id = StringField(required=True, unique=True)
	email = StringField(default=None)
	voting_no = IntField(required=True, unique=True)
	voted = BooleanField(required=True, default=False)
	
	def __str__(self):
		return '[{}, {}, {}, {}]'.format(self.student_id, self.fullname, self.email, self.voting_no)

MEMBERS = []

print('Connecting to the database..')
#connect('dita_dev', host='ds025180.mlab.com', port=25180, username='root', password='root')
connect('dita_ballot_box')
print('Connected...')

with open('acs_mis.csv', 'r') as students_file:
    reader = csv.reader(students_file)
    rows = [row for row in reader]
    rows.pop(0)

    print("Importing students...")
    count = 1
    for row in rows:
        student = Student()
        if row[3].strip() == "BSc Applied Computer Science":
            print('Insertion {}'.format(count))
            student.fullname = row[2].strip().lower()
            student.student_id = row[1].strip()
            student.voting_no = random.randint(10000,99999)
            email = row[4].strip()
            if '<' in email:
                email = email[email.index('<')+1:]
                if '>' in email:
                    email = email[:email.index('>')]
                student.email = email
            student.save()
            count = count + 1
			


print("Import complete")
