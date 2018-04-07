import pandas as pd


def clean_data(file_path):
    '''
    Load the data into a pandas dataframe
    :param  file_path   path to the dataset
    :return: pandas dataframe
    '''

    to_delete = set(['ISO', 'Location', 'Latitude', 'Longitude', 'Magnitude value',
                     'Magnitude', 'scale', 'Disaster No.', 'Disaster subtype', 'Magnitude scale', 'Disaster name'])

    dataframe = pd.read_csv(file_path, sep=',', encoding='latin-1')

    # Drop extra columns
    for col_name in dataframe:
        if col_name in to_delete:
            dataframe.drop(col_name, axis=1, inplace=True)

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
    dataframe.drop('Start date', axis=1, inplace=True)
    dataframe.drop('End date', axis=1, inplace=True)

    return dataframe


if __name__ == '__main__':
    cleaned_dataframe = clean_data('dataset.csv')
    cleaned_dataframe.to_csv('output.csv')