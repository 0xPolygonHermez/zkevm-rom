import json
import os

dir_path = os.path.dirname(os.path.realpath(__file__))

with open(dir_path + '/modexp-counters.json') as f:
    data = json.load(f)

points = []
valuesArith = []
valuesBinary = []
valuesSteps = []
for i in range(0, len(data)):
    points.append([data[i]['lenR'],data[i]['lenB'],data[i]['lenM']])
    valuesArith.append(data[i]['cntArith'])
    valuesBinary.append(data[i]['cntBinary'])
    valuesSteps.append(data[i]['cntSteps'])

R.<x,y,z> = PolynomialRing(QQ)

def findInterpolation(points, values):
    for i in range(1, 11):
        for j in range(1, i+1):
            for k in range(1, j+1):
                try:
                    f = R.interpolation([i,j,k], points, values)
                    return f
                except:
                    pass

f1 = findInterpolation(points, valuesArith)
f2 = findInterpolation(points, valuesBinary)
f3 = findInterpolation(points, valuesSteps)
print("f1",f1)
print("f2",f2)
print("f3",f3)
print(f1(3,2,1), f2(3,2,1), f3(3,2,1))