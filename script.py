text = '''
'''

import pyautogui
import time

time.sleep(5)
prev_i = ''
for i in text:
    if i == '}':
        pyautogui.press('right')
        continue
    time.sleep(1/1000)
    pyautogui.write(i)
    prev_i = i