#This Python file is to clean and prepare the dataset for the backend code.

#Contributers: Harishan


#calling pandas which is a Python library to process the csv data
import pandas as pd

#this for writing to json files
import json

#library for regular expressions
import re


#defining cosntants

inputFile = ("OccupationsDataset.csv")

outputFile = ("ProcessedOccupationsDataset.json")


#Load the dataset
df = pd.read_csv("OccupationsDataset.csv")



