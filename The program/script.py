import nltk
from nltk import word_tokenize,wordpunct_tokenize
from nltk.util import ngrams
classifier= nltk.data.load("classifiers/plusminus.pickle")
openfile = open('hello.txt', 'r')
twe=openfile.read()
words=wordpunct_tokenize(twe)
feats = dict([(word, True) for word in words + ngrams(words, 2)])
xa= classifier.classify(feats)
if xa=='pos':
    classifier= nltk.data.load("classifiers/happyfunny.pickle")
    posi= classifier.classify(feats)
    if posi=='pos':
        openfile = open('mood.js', 'w')
        openfile.write('var md=1;')
    elif posi=='neg':
        openfile = open('mood.js', 'w')
        openfile.write('var md=2;')
elif xa=='neg':
    classifier= nltk.data.load("classifiers/sadangry.pickle")
    posi= classifier.classify(feats)
    if posi=='pos':
        openfile = open('mood.js', 'w')
        openfile.write('var md=3;')
    elif posi=='neg':
        openfile = open('mood.js', 'w')
        openfile.write('var md=4;')
