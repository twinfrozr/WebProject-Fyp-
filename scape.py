import requests
from lxml import html
import json
import sys


class product:
    def __init__(self,name,price,rating,NoOfRating,imgURL):
        self.name = name
        self.price = price
        self.rating = rating
        self.NoOfRating = NoOfRating
        self.imgURL = imgURL






def scrapeData(keyword):
    url='https://www.daraz.pk/catalog/?q={}'.format(keyword)
    #print('Searching URL : ',url)
    arr=[]
    #initialiaizing header 
    header={
        'authority':'www.daraz.pk',
        'method':'GET',
        'scheme': 'https',
        'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,appliaction/signed-exchange;v=b3;q=0.9',
        'accept-encoding':'gzip,deflate,br',
        'accept-language':'en,en-US;q=0.9,ur-PK;q=0.8,ur;q=0.7',
        'cache-control':'max-age=0',
        'sec-ch-ua':'"Google Chrome";v="89","chromium",v="89",";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest':'document',
        'sec-fetch-mode':'navigate',
        'sec-fetch-site':'same-origin',
        'sec-fetch-user':'?1',
        'upgrade-insecure-requests':'1',
        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
    
        }

    response=requests.get(url,headers=header,timeout=60)
    byte_data=response.text
    source_code=html.fromstring(byte_data)
    #printing server response 
    #print('Response',response)

    try:
        #extraxcting json page data using xpath located with in a search page 
        jsonRawData=source_code.xpath("//script[contains(text(),'window.pageData')]")
        jsonRawData=jsonRawData[0].text_content().strip()
        #shaping it to exact json format for further processing 
        jsonRawData=jsonRawData.replace('window.pageData=','')
        #lodaing in json module for further processing 
        jsonData=json.loads(jsonRawData)
        data=jsonData['mods']['listItems']
        limit = 5
        index = 0
        # arr = []
        for d in data:
            
            try:
                name=d['name']
                
            
            except:
                name=''
            try:
                price=d['price']
                
            
            except:
                price=''
            try:
                ratingScore=d['ratingScore']
                
            
            except:
                ratingScore=''
            try:
                reviewNumber=d['review']
                
            
            except:
                reviewNumber=''
            try:
                imgUrl = d['image']
            except:
                imgUrl=''
            
            arr.append(product(name, price, ratingScore, int(float(reviewNumber)), imgUrl))
            
            #print('Name : ',name,'Price : ',int(float(price)),'No of Reviews : ',int(float(reviewNumber)), 'Rating : ',float(ratingScore),'ImgURL :', imgUrl)
            #print(arr)
            #toStr =json.dumps(d)

            #print("'" + toStr + "'")
        
    except Exception as e:
            print(e)
            
    if arr:
        newList = sorted(arr, key=lambda x: x.NoOfRating, reverse=True)

        for obj in newList:
            print('| Product Name: ' , obj.name, '\n' ,' | Price:(Rs) ', obj.price, '\n',' | Average Rating: ', obj.rating, '\n',' | No of Reviews: ', obj.NoOfRating, '\n', '  ImgURL:^',obj.imgURL, '@')
        
            index +=1

            if index == limit:
                break
    else:
        print("")
    # newList = sorted(arr, key=lambda x: x.NoOfRating, reverse=True)

    # for obj in newList:
    #     print('Product Name: ' , obj.name,' --- Price:(Rs) ', obj.price,' --- Average Rating: ', obj.rating,' --- No of Ratings: ', obj.NoOfRating, '@')#'ImgURL: ', obj.imgURL)
        
    #     index +=1

    #     if index == limit:
    #         break
       
    
searchKeyword=sys.argv[1]
#print('Scraping keyword : ',searchKeyword)

try:
    catLinkList=scrapeData(searchKeyword)
    # for obj in arr:
    #     print(obj.name, obj.price, obj.rating, obj.NoOfRating, obj.imgURL)

except Exception as e:
    print(e)



# resp={
        #     "Message":"Data from Python",
        #     "Data":data
        # }
        # print(json.dumps(resp))
        # sys.stdout.flush()