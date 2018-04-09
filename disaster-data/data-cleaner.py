# import pandas as pd
import csv
import json

def csv_dict_list(datafile):
    reader = csv.DictReader(open(datafile, 'rb'))
    dict_list = []
    numerical_columns = ["Year", "Insured losses", "Total damage", "Total deaths"]
    for line in reader:
        for col in numerical_columns:
            line[col] = int(line[col])
        dict_list.append(line)
    return dict_list


def clean_data(file_path):
    '''
    Load the data into a pandas dataframe
    :param  file_path   path to the dataset
    :return: pandas dataframe
    '''

    to_delete = set(['Location', 'Latitude', 'Longitude', 'Magnitude value',
                     'Magnitude', 'scale', 'Disaster No.', 'Disaster subtype', 'Magnitude scale', 'Disaster name'])

    dataframe = pd.read_csv(file_path, sep=',', encoding='latin-1')

    # Drop extra columns
    for col_name in dataframe:
        if col_name in to_delete:
            dataframe.drop(col_name, axis = 1, inplace = True)

    # Insert new column for year
    dataframe['Year'] = ''


    # Update year field
    for row in dataframe.itertuples():
        year = 0

        if len(row._1.split('/')[-1]) == 2:
            year = 2000 + int(row._1.split('/')[-1])
        else:
            year = int(row._1.split('/')[-1])

        dataframe.loc[row.Index, 'Year'] = year

    # Drop start and end date columns
    dataframe.drop('Start date', axis = 1, inplace = True)
    dataframe.drop('End date', axis=1, inplace=True)

    return dataframe



class Disaster:
    def __init__(self, country, iso, disaster_type, total_deaths, total_damage, insured_losses, year):
        self.disaster_type = disaster_type
        self.country = country
        self.iso = iso
        self.total_deaths = int(total_deaths)
        self.total_damage = int(total_damage)
        self.insured_losses = int(insured_losses)
        self.year = year

disaster = Disaster(1,1,1,1,1,1,1)


def group_data():
    '''
    Once cleaned group the data in the dataframe by year and disaster
    :param dataframe: pandas dataframe
    :return: None
    '''
    global disaster
    # Create a new dataframe

    dataframe = pd.read_csv('output2.csv', sep=',')
    new_dataframe = pd.DataFrame(columns=['Country', 'ISO', 'Disaster type', 'Total deaths', 'Total damage', 'Insured losses', 'Year'])

    row_list = []



    for index, row in dataframe.iterrows():
        if index == 0:
            disaster = Disaster(row['Country'], row['ISO'], row['Disaster type'], row['Total deaths'], row['Total damage'], row['Insured losses'], row['Year'])
            continue

        # If a new country is encountered, or a different year, or a different disaster then
        # add the disaster to the new dataframe
        # print(row['Year'] == disaster.year)
        # break


        if row['Country'] != disaster.country or row['Disaster type'] != disaster.disaster_type or row['Year'] != disaster.year:
            # Append disaster to new dataframe
            new_row = {
                'Country' : disaster.country,
                'ISO': disaster.iso,
                'Disaster type': disaster.disaster_type,
                'Total deaths': disaster.total_deaths,
                'Total damage': disaster.total_damage,
                'Insured losses': disaster.insured_losses,
                'Year': disaster.year
            }
            # new_dataframe.append(new_row, ignore_index=True)
            row_list.append(new_row)

            # Create the new disaster instance
            disaster = Disaster(row['Country'], row['ISO'], row['Disaster type'], row['Total deaths'], row['Total damage'], row['Insured losses'], row['Year'])

        else:
            # If the same year, and disaster, and country then add the deaths, losses, damages
            disaster.total_deaths += int(row['Total deaths'])
            disaster.total_damage += int(row['Total damage'])
            disaster.insured_losses += int(row['Insured losses'])

    new_dataframe = pd.DataFrame(row_list)

    return new_dataframe

if __name__ == '__main__':
    # cleaned_dataframe = clean_data('dataset.csv')
    # refined_dataframe = group_data(cleaned_dataframe)
    # refined_dataframe.to_csv('output_refined.csv')

    # group_data(cleaned_dataframe)
    # refined_dataframe = group_data()
    # refined_dataframe.to_csv('output_refined.csv')
    d = csv_dict_list("output_refined.csv")
    with open('output_refined.json', 'w') as fh:
        json.dump(d, fh)

