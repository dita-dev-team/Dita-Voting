import socket
import time
import unittest
from pymongo import MongoClient
from random import choice, randint
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select

class DitaBallotBox(unittest.TestCase):
	
	@classmethod
	def setUpClass(cls):
		cls.client = MongoClient()
		cls.db = cls.client.dita_ballot_box
		import importer
		
	def setUp(self):
		self.driver = webdriver.Firefox()
				
		
	def test_index(self):
		self.driver.get("http://localhost:3000")
		assert "Welcome to Dita Ballot Box" in self.driver.page_source
		
	def test_register(self):
		self.driver.get("http://localhost:3000/register")
		element = self.driver.find_element_by_id('studentID')
		element.send_keys('00-0000')
		element.submit()
		
		assert "Must be an ACS student" in self.driver.page_source
		
		element = self.driver.find_element_by_id('studentID')
		element.send_keys('16-0128')
		element.submit()
		
		assert "Must be a third or fourth year" in self.driver.page_source
		
		element = self.driver.find_element_by_id('studentID')
		element.send_keys('14-2873')
		element.submit()
		
		assert "Registration successful" in self.driver.page_source
		
		link = self.driver.find_element_by_link_text('Register')
		link.click()
		
		element = self.driver.find_element_by_id('studentID')
		element.send_keys('14-2873')
		element.submit()
		
		assert "Candidate already registered" in self.driver.page_source
		
	def test_vote(self):
		student_ids = ['14-2873', '14-1863', '14-2868', '14-2112', '14-0267', '14-2433', '14-2709', '14-1103', '14-0430', '14-0528']
		
		self.driver.get("http://localhost:3000/register")
		
		for i, s in enumerate(student_ids):
			element = self.driver.find_element_by_id('studentID')
			element.send_keys(s)
			select = Select(self.driver.find_element_by_id('postNomination'))
			index = i if i < 7 else randint(0, 6)
			select.select_by_index(index)
			element.submit()
		
			assert "Registration successful" in self.driver.page_source
		
			link = self.driver.find_element_by_link_text('Register')
			link.click()
			
		assert self.db.candidate.find().count() == len(student_ids)
		
		link = self.driver.find_element_by_link_text('Vote')
		link.click()
		
		element = self.driver.find_element_by_id('votingNumber');
		element.send_keys('00000')
		element.submit()
		
		assert "Please enter a valid voting number" in self.driver.page_source
		
		cursor = self.db.student.find_one({'student_id': student_ids[0]})
		no = cursor['voting_no']
		
		element = self.driver.find_element_by_id('votingNumber');
		element.send_keys(no)
		element.submit()
		
		assert "Thank you for particapting in the Dita Elections." in self.driver.page_source
		
		link = self.driver.find_element_by_link_text('Vote')
		link.click()
		
		cursor = self.db.student.find_one({'student_id': student_ids[0]})
		no = cursor['voting_no']
		
		element = self.driver.find_element_by_id('votingNumber');
		element.send_keys(no)
		element.submit()
		
		assert "This voting number has already been used" in self.driver.page_source
		
		positions = [
			'chairperson',
			'vicechair',
			'secretary',
			'pr',
			'os',
			'treasurer',
			'rm'
		]
		
		for i, s in enumerate(student_ids):
			cursor = self.db.student.find_one({'student_id': student_ids[i]})
			no = cursor['voting_no']
			
			element = self.driver.find_element_by_id('votingNumber');
			element.send_keys(no)
			
			for p in positions:
				select = Select(self.driver.find_element_by_id(p))
				select.select_by_visible_text(choice([o.text for o in select.options]))

			
			element.submit()
		
			link = self.driver.find_element_by_link_text('Vote')
			link.click()
	
		link = self.driver.find_element_by_link_text('Home')
		link.click()	
		cursor = self.db.candidate.find()
		votes = 0
		
		for candidate in cursor:
			votes += candidate['votes']
			
		
		link = self.driver.find_element_by_link_text('Results')
		link.click()
		
		assert votes == len(student_ids) * len(positions)
		
	def tearDown(self):
		self.db.candidate.delete_many({})
		#self.driver.close()
		
	@classmethod
	def tearDownClass(cls):
		cls.client.drop_database('dita_ballot_box')


def check_server(address, port):
	s = socket.socket()
	print("Connecting to {} on port {}".format(address, port))
	try:
		s.connect((address,  port))
		print("Successfully connected")
		return True
	except socket.error:
		print("Connection failed")
		return False
		

		
		
if __name__ == '__main__':
	if not check_server('localhost', 3000):
		exit()
		
	unittest.main()
		
	
