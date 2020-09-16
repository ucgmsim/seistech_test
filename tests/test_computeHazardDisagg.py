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
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.chrome.options import Options
import glob
import os

chrome_options = Options()
if os.environ['HOST_NAME'].startswith("travis"):
    chrome_options.add_argument("--headless")

class TestComputeHazardDisagg():
  def setup_method(self, method):
    self.driver = webdriver.Chrome(options=chrome_options)
    self.vars = {}
    try:
        self.deploy_name=os.environ['DEPLOY_NAME']+"."
    except:
        pass
    if len(self.deploy_name)==1:
        self.deploy_name=''
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def test_computeHazardDisagg(self):
    self.driver.get("https://{}seistech.nz/".format(self.deployname))
    self.driver.set_window_size(1680, 1027)
    self.driver.find_element(By.ID, "qs-login-btn").click()
    self.driver.find_element(By.ID, "username").click()
    self.driver.find_element(By.ID, "username").send_keys("sungeunbae@live.com")
    self.driver.find_element(By.ID, "password").send_keys("Yonsei96!")
    self.driver.find_element(By.NAME, "action").click()
    WebDriverWait(self.driver, 30000).until(expected_conditions.presence_of_element_located((By.XPATH, "//a[contains(text(),\'Hazard Analysis\')]")))
    self.driver.find_element(By.LINK_TEXT, "Hazard Analysis").click()
    element = self.driver.find_element(By.LINK_TEXT, "Hazard Analysis")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.execute_script("window.scrollTo(0,0)")
    self.driver.find_element(By.ID, "haz-lat").click()
    self.driver.find_element(By.ID, "haz-lat").clear()
    self.driver.find_element(By.ID, "haz-lat").send_keys("-43.60")
    self.driver.find_element(By.ID, "haz-lng").click()
    self.driver.find_element(By.ID, "haz-lng").clear()
    self.driver.find_element(By.ID, "haz-lng").send_keys("172.72")
    self.driver.find_element(By.ID, "site-selection").click()
    time.sleep(3)
    WebDriverWait(self.driver, 20000).until(expected_conditions.invisibility_of_element_located((By.CSS_SELECTOR, "#uncontrolled-tab-example-tab-hazard[aria-disabled]")))
    self.driver.find_element(By.XPATH, "//a[contains(.,\'Seismic Hazard\')]").click()
    self.driver.find_element(By.ID, "IMs").click()
    dropdown = self.driver.find_element(By.ID, "IMs")
    dropdown.find_element(By.XPATH, "//option[. = 'PGA']").click()
    self.driver.find_element(By.ID, "IMs").click()
    self.driver.find_element(By.ID, "im-select").click()
    WebDriverWait(self.driver, 30000).until(expected_conditions.invisibility_of_element_located((By.CSS_SELECTOR, ".hazard-curve-viewer > .download-button[disabled]")))
    self.driver.find_element(By.CSS_SELECTOR, ".hazard-curve-viewer > .download-button").click()
    self.driver.find_element(By.ID, "im-select").click()
    self.driver.find_element(By.ID, "annual-rate").click()
    self.driver.find_element(By.ID, "annual-rate").clear()
    self.driver.find_element(By.ID, "annual-rate").send_keys("0.2")
    self.driver.find_element(By.ID, "prob-update").click()
    self.driver.find_element(By.XPATH, "//a[contains(text(),\'Disaggregation\')]").click()
    WebDriverWait(self.driver, 60000).until(expected_conditions.invisibility_of_element_located((By.CSS_SELECTOR, "#uncontrolled-tab-example-tabpane-disagg > .download-button[disabled]")))
    self.driver.find_element(By.CSS_SELECTOR, "#uncontrolled-tab-example-tabpane-disagg > .download-button").click()
    time.sleep(10)
    zip_files= glob.glob("*.zip")
    assert len(zip_files)==2

  
