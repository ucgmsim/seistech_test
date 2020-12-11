import os
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

def set_chrome_options():
    chrome_options = Options()
    if os.environ.get('USER') and os.environ['USER']=='jenkins':
        chrome_options.add_argument("--headless")

    return chrome_options

def wait_and_click_button(driver,target_by,target_keyword):
    #works with a button usually searched by CSS_SELECTOR
    def this_button():
        return driver.find_element(target_by,target_keyword)

    while this_button().get_attribute('disabled') != None:
        print("Wait: "+target_keyword+" not ready")
        time.sleep(5)

    this_button().click()

def wait_and_click(driver, target_by, target_keyword):
    #works with ordinary links or standard HTML elements searched by ID, XPATH or LINK_TEXT
    while True:
        try:
            driver.find_element(target_by, target_keyword).click()
        except exceptions.ElementClickInterceptedException:
            print("Wait: "+target_keyword+" not ready")
            time.sleep(5)
        else:
            break


def clear_input_field(driver,target_by,target_keyword):
    def this_field() :
        return driver.find_element(target_by, target_keyword)
 
    while this_field().get_attribute('value')!='':
        this_field().send_keys(Keys.BACKSPACE)
    this_field().send_keys(Keys.BACKSPACE)

def check_error_display(driver):
    assert len(driver.find_elements(By.CSS_SELECTOR, ".text-white > .card-header")) == 0




