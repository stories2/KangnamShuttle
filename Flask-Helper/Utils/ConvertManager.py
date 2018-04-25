from datetime import datetime
import math

def SecondsToDateTime(seconds):
    customDateTime = {}
    customDateTime["days"] = math.floor(seconds / (24 * 60 * 60))
    seconds = math.floor(seconds % (24 * 60 * 60))
    customDateTime["hours"] = math.floor(seconds / (60 * 60))
    seconds = math.floor(seconds % (60 * 60))
    customDateTime["mins"] = math.floor(math.floor(seconds / 60))
    seconds = math.floor(seconds % 60)
    customDateTime["sec"] = math.floor(seconds)
    return customDateTime