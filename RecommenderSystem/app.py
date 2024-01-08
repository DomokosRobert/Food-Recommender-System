import pandas as pd
import math
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from flask import *
from flask_cors import CORS
import json
import random

app = Flask(__name__)
CORS(app, origins='http://localhost:3000', allow_headers=['Content-Type'])

def process_alternative_csv(input_csv):
    
    alternative = pd.read_csv(input_csv, header=0)
    alternative.fillna(0, inplace=True)
    alternative.drop(['Calcium', 'Iron', 'Potassium', 'VitaminC', 'VitaminE', 'VitaminD'], axis=1, inplace=True)
    alternative = alternative.replace(0, 0.000001)
    return alternative

def calculate_bmr(weight,height,age):
   my_bmr = 66 + 13.75  * weight + 5 * height - 6.75  * age
   bmi = weight/ (height*height/100)
   return my_bmr, bmi

def calculate_final_calories(weight, height, age, activity_level,goal):
    my_bmr, bmi = calculate_bmr(weight,height,age)
    activity_level_table = {
        'Activity Level': ['LITTLE', 'LIGHT', 'MODERATE', 'STRONG', 'EXTREME'],
        'BMR Factor': [1.2, 1.375, 1.55, 1.725, 1.9]
    }
    activity_index = activity_level_table['Activity Level'].index(activity_level)
    my_calories = my_bmr * activity_level_table['BMR Factor'][activity_index]
    new_calories = math.ceil(my_calories / 10) * 10
    if goal == 'GAIN':
       final_calories = new_calories + 300
    elif goal == 'LOSE':
       final_calories = new_calories - 300
    else:
       final_calories = new_calories
    return final_calories


def get_limiting_profile(user_type, bmi):
    limiting_profile = {
        
        'Protein': [100, 120, 100, 100, 120],
        'TotalFat': [80, 72, 80, 80, 80],
        'Carbohydrate': [240, 216, 192, 240, 288],
        'Sodium': [3000, 3000, 3000, 1500, 3000],
        'SaturatedFat': [60, 54, 60, 60, 60],
        'Cholesterol': [300, 300, 300, 300, 300],
        'Sugar': [70, 63, 56, 70, 70],
        'UserType': ['HEALTHY', 'OVERWEIGHT', 'DIABETES', 'HYPERTENSIVE', 'UNDERWEIGHT']
    }

    userT = 'HEALTHY'
    if bmi < 20:
       userT = 'UNDERWEIGHT'
    if bmi > 25:
       userT = 'OVERWEIGHT'
    
    limiting_profile_df = pd.DataFrame(limiting_profile)
    result = limiting_profile_df[limiting_profile_df['UserType'].isin([user_type,userT])]
    result = result.drop(['UserType'],axis=1)
    values = result.min().values
    return values

def create_comparison_matrix():
  items = ['Protein','TotalFat','Carbohydrate','Sodium','SaturatedFat','Cholesterol','Sugar']
  comparison_matrix= pd.DataFrame(columns=items, index=items)

  comparison_matrix['Protein']['TotalFat'] = 3
  comparison_matrix['Protein']['Carbohydrate'] = 2
  comparison_matrix['Protein']['Sodium'] = 2
  comparison_matrix['Protein']['SaturatedFat'] = 3
  comparison_matrix['Protein']['Cholesterol'] = 2
  comparison_matrix['Protein']['Sugar'] = 3

  comparison_matrix['TotalFat']['Carbohydrate'] = 1/3
  comparison_matrix['TotalFat']['Sodium'] = 1/3
  comparison_matrix['TotalFat']['SaturatedFat'] = 1/2
  comparison_matrix['TotalFat']['Cholesterol'] = 1/2
  comparison_matrix['TotalFat']['Sugar'] = 1/2

  comparison_matrix['Carbohydrate']['Sodium'] = 1/2
  comparison_matrix['Carbohydrate']['SaturatedFat']= 2
  comparison_matrix['Carbohydrate']['Cholesterol'] = 1
  comparison_matrix['Carbohydrate']['Sugar'] = 2

  comparison_matrix['Sodium']['SaturatedFat'] = 2
  comparison_matrix['Sodium']['Cholesterol'] = 1
  comparison_matrix['Sodium']['Sugar'] = 1

  comparison_matrix['SaturatedFat']['Cholesterol'] = 1/2
  comparison_matrix['SaturatedFat']['Sugar'] = 1/2

  comparison_matrix['Cholesterol']['Sugar'] = 1

  for i in range(len(items)):
      for j in range(len(items)):
          if i == j:
              comparison_matrix.iloc[j][i] = 1
          else:
            if j < i:
              comparison_matrix.iloc[j][i] = pow(comparison_matrix.iloc[i][j],-1)
  
  return comparison_matrix


def calculate_weights_from_matrix(cmp_matrix):
    cmp_matrix = np.array(cmp_matrix, dtype=float)
    comp = cmp_matrix.T
    norm_matrix = comp / comp.sum(axis=0)
    eigenvalues, eigenvectors = np.linalg.eig(norm_matrix)
    max_eigenvalue_index = np.argmax(eigenvalues)
    max_eigenvector = eigenvectors[:, max_eigenvalue_index]
    max_eigenvalue = eigenvalues[max_eigenvalue_index]
    CI = (max_eigenvalue - comp.shape[0]) / (comp.shape[0] - 1)
    RI = 1.32
    CR = CI / RI

    if CR < 0.1:
        print("Consistent")
    else:
        print("Inconsistent")

    weight_vector = max_eigenvector.real / sum(max_eigenvector.real)
    weights = [round(value, 3) for value in weight_vector]

    return weights

def calculate_appropriate_foods(limiting_profile, alternative, weights):
    limiting_list = limiting_profile.tolist()
    appropriate = pd.DataFrame(columns=['ID', 'Description', 'Calories', 'Protein', 'TotalFat', 'Carbohydrate',
                                       'Sodium', 'SaturatedFat', 'Cholesterol', 'Sugar', 'ServingSize'])
    poz = 0

    for v in range(len(alternative)):
        local_list_limiting = []
        local_list_alternatives = []
        for i in range(0, 6):
            M = np.zeros((2, 2))
            M[0, 0] = 1
            M[0, 1] = abs(limiting_list[i] / alternative.iloc[v][i + 3])
            M[1, 0] = abs(alternative.iloc[v][i + 3] / limiting_list[i])
            M[1, 1] = 1
            egnval, egnvect = np.linalg.eig(M)
            maxegnval = np.argmax(egnval)
            domegnvector = egnvect[:, maxegnval]
            local_priorities = domegnvector / domegnvector.sum()
            local_prio = [round(value, 4) for value in local_priorities]
            local_list_limiting.append(local_prio[0] * weights[i] / 6)
            local_list_alternatives.append(local_prio[1] * weights[i])
        lla = [round(value, 4) for value in local_list_alternatives]
        lll = [round(value, 4) for value in local_list_limiting]
        suma = np.sum(lla) / 7
        suml = np.sum(lll) / 7

        if suma <= suml:
            appropriate.loc[poz] = alternative.iloc[v]
            poz += 1

    return appropriate

def classify_appropriate_foods(apropriate):
  apropriate['ID'] = apropriate['ID'].astype(int)
  apropriate['Calories'] = apropriate['Calories'].astype(float)
  apropriate['Protein'] = apropriate['Protein'].astype(float)
  apropriate['TotalFat'] = apropriate['TotalFat'].astype(float)
  apropriate['Carbohydrate'] = apropriate['Carbohydrate'].astype(float)
  apropriate['Sodium'] = apropriate['Sodium'].astype(float)
  apropriate['SaturatedFat'] = apropriate['SaturatedFat'].astype(float)
  apropriate['Cholesterol'] = apropriate['Cholesterol'].astype(float)
  apropriate['Sugar'] = apropriate['Sugar'].astype(float)
  apropriate['ServingSize'] = apropriate['ServingSize'].astype(float)
  apropriate['FoodType'] = ''

  for i in range(len(apropriate)):
    if apropriate.iloc[i]['ID'] > 1000 and apropriate.iloc[i]['ID'] < 1256 :
        apropriate.at[i,'FoodType']='Milks'
    else:
      if apropriate.iloc[i]['ID'] > 5000 and apropriate.iloc[i]['ID'] < 5678 :
          apropriate.at[i,'FoodType']='Proteins'
      else:
        if apropriate.iloc[i]['ID'] > 7000 and apropriate.iloc[i]['ID'] < 7961 :
            apropriate.at[i,'FoodType']='Proteins'
        else:
          if apropriate.iloc[i]['ID'] > 8000 and apropriate.iloc[i]['ID'] < 8645 :
              apropriate.at[i,'FoodType']='Cereals'
          else:
            if apropriate.iloc[i]['ID'] > 9000 and apropriate.iloc[i]['ID'] < 9453 :
                apropriate.at[i,'FoodType']='Fruits'
            else:
              if apropriate.iloc[i]['ID'] > 9999 and apropriate.iloc[i]['ID'] < 10994 :
                  apropriate.at[i,'FoodType']='Proteins'
              else:
                if apropriate.iloc[i]['ID'] > 11000 and apropriate.iloc[i]['ID'] < 11999 :
                    apropriate.at[i,'FoodType']='Vegies'
                else:
                  if apropriate.iloc[i]['ID'] > 12999 and apropriate.iloc[i]['ID'] < 13988 :
                      apropriate.at[i,'FoodType']='Proteins'
                  else:
                    if apropriate.iloc[i]['ID'] > 15000 and apropriate.iloc[i]['ID'] < 15266 :
                        apropriate.at[i,'FoodType']='Proteins'
                    else:
                      if apropriate.iloc[i]['ID'] > 16000 and apropriate.iloc[i]['ID'] < 16387 :
                          apropriate.at[i,'FoodType']='Carbs'
                      else:
                        if apropriate.iloc[i]['ID'] > 17000 and apropriate.iloc[i]['ID'] < 17349 :
                            apropriate.at[i,'FoodType']='Proteins'
                        else:
                          if apropriate.iloc[i]['ID'] > 18000 and apropriate.iloc[i]['ID'] < 18983 :
                              apropriate.at[i,'FoodType']='Carbs'
                          else:
                            if apropriate.iloc[i]['ID'] > 20000 and apropriate.iloc[i]['ID'] < 20650 :
                                apropriate.at[i,'FoodType']='Carbs'
                            else:
                              if apropriate.iloc[i]['ID'] > 22999 and apropriate.iloc[i]['ID'] < 23661 :
                                  apropriate.at[i,'FoodType']='Proteins'
                              else:
                                apropriate.at[i,'FoodType']='Other'
  apropriate.drop(apropriate[apropriate['FoodType']=='Other'].index, inplace=True)
  return apropriate

def similar_food(s1, s2):
    tokens1 = set(s1.lower().split())
    tokens2 = set(s2.lower().split())
    intersection = tokens1.intersection(tokens2)
    union = tokens1.union(tokens2)
    score = len(intersection) / len(union) * 100
    return score

def find_closest_food(preferences, appropriate, knn, X_test,y_test):
    sim_scores = [similar_food(preferences,desc) for desc in y_test]
    max_index = max(range(len(sim_scores)),key = sim_scores.__getitem__)
    closest_foods = knn.predict([X_test.iloc[max_index]])
    food = appropriate[appropriate['Description']==closest_foods[0]]
    return food

def standardization(feature):
   mean = sum(feature)/len(feature)
   var = sum((x-mean)** 2 for x in feature)/len(feature)
   deviation = math.sqrt(var)
   scaled = [(x-mean)/deviation for x in feature]
   return scaled

def train_knn_model(appropriate):
    X = appropriate.drop(['ID', 'Description', 'FoodType','ServingSize'], axis=1)
    X.columns = ['Calories', 'Protein', 'TotalFat', 'Carbohydrate', 'Sodium', 'SaturatedFat', 'Cholesterol', 'Sugar']
    y = appropriate[['Description']]
    X_scaled = X.apply(standardization)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled,y.values.ravel(), test_size=0.2, random_state=50)
    knn = KNeighborsClassifier(n_neighbors=1)
    knn.fit(X_train,y_train)
    return knn, X_test,y_test

def generate_menu(appropriate, preferences, calories):

    knn, X_test,y_test = train_knn_model(appropriate)
    words = preferences.split(',')
    proteins = []
    milks = []
    fruits =[]
    cereals =[]
    carbs =[]
    vegies = []
    foods = []

    for pref in words:

        food = find_closest_food(pref,appropriate,knn,X_test,y_test)
        if food['FoodType'].values[0] == 'Milks':
            milks.append(food)
        elif food['FoodType'].values[0] == 'Cereals':
           cereals.append(food)
        elif food['FoodType'].values[0] == 'Fruits':
           fruits.append(food)
        elif food['FoodType'].values[0] == 'Proteins':
           proteins.append(food)
        elif food['FoodType'].values[0] == 'Carbs':
           carbs.append(food)
        elif food['FoodType'].values[0] == 'Vegies':
           vegies.append(food)
    
    calories_now = 0
    while calories_now < calories:
        calories_now = 0
        if len(milks) != 0:
            foods.append(milks[0].to_dict())
            calories_now = calories_now + milks[0]['Calories'].values[0]*milks[0]['ServingSize'].values[0]
        else :
           all_milks = appropriate[appropriate['FoodType']=='Milks']
           rand = all_milks.sample(n=1, random_state=random.seed())
           calories_now = calories_now + rand['Calories'].values[0]*rand['ServingSize'].values[0]
           foods.append(rand.to_dict())

        if len(cereals) != 0:
            foods.append(cereals[0].to_dict())
            calories_now = calories_now + cereals[0]['Calories'].values[0]*cereals[0]['ServingSize'].values[0]
        else :
           all_cereals = appropriate[appropriate['FoodType']=='Cereals']
           rand = all_cereals.sample(n=1, random_state=random.seed())
           calories_now = calories_now + rand['Calories'].values[0]*rand['ServingSize'].values[0]
           foods.append(rand.to_dict())

        if len(fruits) != 0:
            foods.append(fruits[0].to_dict())
            calories_now = calories_now + fruits[0]['Calories'].values[0]*fruits[0]['ServingSize'].values[0]
        else :
           all_fruits = appropriate[appropriate['FoodType']=='Fruits']
           rand = all_fruits.sample(n=1, random_state=random.seed())
           calories_now = calories_now + rand['Calories'].values[0]*rand['ServingSize'].values[0]
           foods.append(rand.to_dict())
        
        if len(proteins) != 0:
            foods.append(proteins[0].to_dict())
            calories_now = calories_now + proteins[0]['Calories'].values[0]*proteins[0]['ServingSize'].values[0]
        else :
           all_proteins = appropriate[appropriate['FoodType']=='Proteins']
           rand = all_proteins.sample(n=1, random_state=random.seed())
           calories_now = calories_now + rand['Calories'].values[0]*rand['ServingSize'].values[0]
           foods.append(rand.to_dict())
        
        if len(carbs) != 0:
            foods.append(carbs[0].to_dict())
            calories_now = calories_now + carbs[0]['Calories'].values[0]*carbs[0]['ServingSize'].values[0]
        else :
           all_carbs = appropriate[appropriate['FoodType']=='Carbs']
           rand = all_carbs.sample(n=1, random_state=random.seed())
           calories_now = calories_now + rand['Calories'].values[0]*rand['ServingSize'].values[0]
           foods.append(rand.to_dict())

        if len(vegies) != 0:
            foods.append(vegies[0].to_dict())
            calories_now = calories_now + vegies[0]['Calories'].values[0]*vegies[0]['ServingSize'].values[0]
        else :
           all_vegs = appropriate[appropriate['FoodType']=='Vegies']
           rand = all_vegs.sample(n=1, random_state=random.seed())
           calories_now = calories_now + rand['Calories'].values[0]*rand['ServingSize'].values[0]
           foods.append(rand.to_dict())
        
        if len(proteins) > 1:
            foods.append(proteins[1].to_dict())
            calories_now = calories_now + proteins[1]['Calories'].values[0]*proteins[1]['ServingSize'].values[0]
        else :
           all_proteins = appropriate[appropriate['FoodType']=='Proteins']
           rand = all_proteins.sample(n=1, random_state=random.seed())
           calories_now = calories_now + rand['Calories'].values[0]*rand['ServingSize'].values[0]
           foods.append(rand.to_dict())

        if len(carbs) > 1:
            foods.append(carbs[1].to_dict())
            calories_now = calories_now + carbs[1]['Calories'].values[0]*carbs[1]['ServingSize'].values[0]
        else :
           all_carbs = appropriate[appropriate['FoodType']=='Carbs']
           rand = all_carbs.sample(n=1, random_state=random.seed())
           calories_now = calories_now + rand['Calories'].values[0]*rand['ServingSize'].values[0]
           foods.append(rand.to_dict())

        if len(fruits) >1:
            foods.append(fruits[1].to_dict())
            calories_now = calories_now + fruits[1]['Calories'].values[0]*fruits[1]['ServingSize'].values[0]
        else :
           all_fruits = appropriate[appropriate['FoodType']=='Fruits']
           rand = all_fruits.sample(n=1, random_state=random.seed())
           calories_now = calories_now + rand['Calories'].values[0]*rand['ServingSize'].values[0]
           foods.append(rand.to_dict())
    accuracy, precision, recall, f1_score = calculate_metrics(knn,X_test,y_test,preferences)
    return foods, accuracy, precision, recall, f1_score

def common_words(s1,s2):
   entry1 = set(s1.split())
   entry2 = set(s2.split())
   return bool(entry1.intersection(entry2))

def calculate_metrics(knn,X_test,y_test,preferences):
  true_pred = 0
  total_pred = len(y_test)
  true_pos = 0
  false_pos = 0
  false_neg = 0
  lower_pref = preferences.replace(',',' ')
  pref = lower_pref.upper()
  print(pref.split())
  for i in range(total_pred):
     pred_label = knn.predict([X_test.iloc[i]])[0]
     if common_words(pred_label,y_test[i]):
        true_pred += 1
        if common_words(pred_label,pref):
           true_pos+=1
     else:
        if common_words(pred_label,pref):
           false_pos+=1
        else:
           false_neg+=1
  print(true_pos, false_pos,false_neg)
  accuracy = true_pred / total_pred
  acc = "{:.3f}".format(accuracy)
  precision = true_pos/(true_pos + false_pos + 1e-9)
  prec = "{:.3f}".format(precision)
  recall = true_pos/(true_pos + false_neg + 1e-9)
  rec = "{:.3f}".format(recall)
  f1_score = 2*(precision * recall)/(precision + recall + 1e-9)
  f1 = "{:.3f}".format(f1_score)
  return acc,prec,rec,f1

@app.route('/receive_user',methods=['POST', 'OPTIONS'])
def recommend_menu():
  if request.method == 'OPTIONS':
     response = app.make_default_options_response()
     response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
     return response
  elif request.method == 'POST':
    user_object = request.json
    
    input_csv = "C:\\Users\\robib\\Desktop\\Facultate\\Licenta\\app\\ml\\USDA.csv"
    alternatives = process_alternative_csv(input_csv)

    weight = user_object['weight']
    height = user_object['height']
    age=user_object['age']
    activity_level = user_object['activityLevel']
    userType = user_object['userType']
    preferences = user_object['preferences']
    goal = user_object['goal']
    bmr, bmi = calculate_bmr(weight,height,age)
    calories = calculate_final_calories(weight,height,age,activity_level,goal)
    limiting_profile = get_limiting_profile(userType,bmi)
    matrix = create_comparison_matrix()
    weights = calculate_weights_from_matrix(matrix)
    
    appropriate = calculate_appropriate_foods(limiting_profile,alternatives,weights)
    appropriate = classify_appropriate_foods(appropriate)
    foods, accuracy, precision, recall, f1_score = generate_menu(appropriate, preferences, calories)
    
    data_foods = [{'Description': entry['Description'],'ServingSize': entry['ServingSize']} for entry in foods]  
    print("accuracy = ", accuracy)
    print("precision = ", precision)
    print("recall = ", recall)
    print("f1score = ", f1_score)
    data = {
       'menu': data_foods,
       'accuracy': accuracy,
       'precision': precision,
       'recall': recall,
       'f1score': f1_score
    }
    json_out = json.dumps(data)

    return json_out

if __name__ == '__main__' :
   app.run(port=7777)
