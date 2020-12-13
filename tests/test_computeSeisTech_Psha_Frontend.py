# Generated by Selenium IDE
import pytest
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.common import exceptions
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.chrome.options import Options
import glob
import os

from qctools import set_chrome_options, wait_and_click_button, wait_and_click, clear_input_field, check_error_display


chrome_options = set_chrome_options()

class TestComputeSeisTech_Psha_Frontend():
  def setup_method(self, method):
    self.driver = webdriver.Chrome(options=chrome_options)
    self.vars = {}
    try:
        self.deploy_name=os.environ['DEPLOY_NAME']
    except:
        self.deploy_name="psha-test"

  def teardown_method(self, method):
    self.driver.quit()
  
  def test_computeSeisTech_Psha_Frontend(self):
    self.driver.get("https://{}.seistech.nz/".format(self.deploy_name))
#    assert self.deploy_name == 'psha-test'

    self.driver.set_window_size(1680, 1027)
    self.driver.find_element(By.ID, "qs-login-btn").click()
    self.driver.find_element(By.ID, "username").click()
    self.driver.find_element(By.ID, "username").send_keys("sungeunbae@live.com")
    self.driver.find_element(By.ID, "password").send_keys("randompassword1234@")
    self.driver.find_element(By.NAME, "action").click()

    #Wait until the page is loaded
    WebDriverWait(self.driver, 30000).until(expected_conditions.presence_of_element_located((By.LINK_TEXT, "Hazard Analysis")))
    check_error_display(self.driver)

    #go to Hazard Analysis page
    wait_and_click(self.driver,By.LINK_TEXT, "Hazard Analysis")

    # site selection
    clear_input_field(self.driver,By.ID,"haz-lat")   
    self.driver.find_element(By.ID, "haz-lat").send_keys("-43.60")

    clear_input_field(self.driver,By.ID,"haz-lng")   
    self.driver.find_element(By.ID, "haz-lng").send_keys("172.72")
    self.driver.find_element(By.ID, "site-selection").click()

#   self.driver.find_element(By.ID, "vs30").click()
    # check regional tab
    self.driver.find_element(By.LINK_TEXT, "Regional").click()
    check_error_display(self.driver)
    WebDriverWait(self.driver, 30000).until(expected_conditions.presence_of_element_located((By.XPATH, "//img[@alt=\'Regional Map\']")))

    # check VS30 tab
    self.driver.find_element(By.LINK_TEXT, "VS30").click()
    check_error_display(self.driver)
    WebDriverWait(self.driver, 30000).until(expected_conditions.presence_of_element_located((By.XPATH, "(//img[@alt=\'VS30 Map\'])")))

    # finally check the derived VS30 is consistent with the sample
    value = self.driver.find_element(By.ID, "vs30").get_attribute("value")
    assert value == "465.7"

    # go to Seismic Hazard tab
    wait_and_click(self.driver, By.LINK_TEXT, "Seismic Hazard")

    check_error_display(self.driver)
    wait_and_click(self.driver, By.XPATH,"//div[@id='IMs']/div/div")
    self.driver.find_element(By.ID, "react-select-2-option-0").click() #PGA
    self.driver.find_element(By.ID, "im-select").click()

    self.driver.find_element(By.LINK_TEXT, "Hazard Curve").click()
    self.driver.find_element(By.LINK_TEXT, "Ensemble branches").click()
    check_error_display(self.driver)
    WebDriverWait(self.driver, 30000).until(expected_conditions.presence_of_element_located((By.CSS_SELECTOR, ".active > .hazard-plot .user-select-none")))
    self.driver.find_element(By.LINK_TEXT, "Fault/distributed seismicity contribution").click()
    check_error_display(self.driver)
    WebDriverWait(self.driver, 30000).until(expected_conditions.presence_of_element_located((By.CSS_SELECTOR, ".active > .hazard-plot .user-select-none")))
    self.driver.find_element(By.CSS_SELECTOR, ".hazard-curve-viewer > .download-button").click()

# the above can replace this one below. By having Wait for plotting, it is guaranteed to have the download button enabled
#    wait_and_click_button(self.driver, By.CSS_SELECTOR, ".hazard-curve-viewer > .download-button")
#    time.sleep(10)
#

    clear_input_field(self.driver,By.ID,"disagg-annual-rate")    
    self.driver.find_element(By.ID, "disagg-annual-rate").send_keys("0.2")
    self.driver.find_element(By.ID, "prob-update").click()

    self.driver.find_element(By.LINK_TEXT, "Disaggregation").click()
    self.driver.find_element(By.LINK_TEXT, "Epsilon").click()
    check_error_display(self.driver)
    WebDriverWait(self.driver, 60000).until(expected_conditions.presence_of_element_located((By.CSS_SELECTOR, ".active > .img-fluid")))
    self.driver.find_element(By.LINK_TEXT, "Fault/distributed seismicity").click()
    check_error_display(self.driver)
    WebDriverWait(self.driver, 30000).until(expected_conditions.presence_of_element_located((By.CSS_SELECTOR, ".active > .img-fluid")))
    self.driver.find_element(By.LINK_TEXT, "Source contributions").click()
    check_error_display(self.driver)
    WebDriverWait(self.driver, 30000).until(expected_conditions.presence_of_element_located((By.CSS_SELECTOR, ".thead-dark")))
    self.driver.find_element(By.CSS_SELECTOR, ".disaggregation-viewer > .download-button").click()
   
    clear_input_field(self.driver,By.ID,"uhs-annual-rate")
    self.driver.find_element(By.ID, "uhs-annual-rate").send_keys("0.01")
    self.driver.find_element(By.CSS_SELECTOR, ".uhs-add-btn").click()
    clear_input_field(self.driver,By.ID,"uhs-annual-rate")
    self.driver.find_element(By.ID, "uhs-annual-rate").send_keys("0.011")
    self.driver.find_element(By.CSS_SELECTOR, ".uhs-add-btn").click()
    clear_input_field(self.driver,By.ID,"uhs-annual-rate")
    self.driver.find_element(By.ID, "uhs-annual-rate").send_keys("0.012")
    self.driver.find_element(By.CSS_SELECTOR, ".uhs-add-btn").click()
    self.driver.find_element(By.ID, "uhs-update-plot").click()
    self.driver.find_element(By.LINK_TEXT, "Uniform Hazard Spectrum").click()
    check_error_display(self.driver)
    WebDriverWait(self.driver, 150000).until(expected_conditions.presence_of_element_located((By.CSS_SELECTOR, ".uhs-plot .user-select-none")))
    self.driver.find_element(By.CSS_SELECTOR, ".uhs-viewer > .download-button").click()
 
    time.sleep(10) #wait for the download to complete
    zip_files= glob.glob("*.zip")
    assert len(zip_files)==3

  
