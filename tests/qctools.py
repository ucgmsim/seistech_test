import os
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys


def set_chrome_options():
    chrome_options = Options()
    if os.environ.get('HOST_NAME') and os.environ['HOST_NAME'].startswith("travis"):
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



