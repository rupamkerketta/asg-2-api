# Country Emissions Data - API
An API for providing country wise data on greenhouse emissions.

## Version: 1.0.0

**Contact information:**  
Rupam Kerketta  
https://rupamkerketta.com  
dev.kerkettarupam@gmail.com  

### /countries

#### GET
##### Summary:

List all countries

##### Description:

List of all countries with their name, startYear, endYear and unique _id

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful list of all countries |
| 500 | Internal Server Error! |

### /country/{countryId}

#### GET
##### Summary:

Get the country info

##### Description:

Country info with countryName, startYear, endYear, unique _id and all the available categories

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| countryId | path | Country ID | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Country info with the specific country ID |
| 400 | Bad user input in params or query |
| 404 | Country ID does not exists! |
| 500 | Internal Server Error! |

### /country/{countryId}/year-info/{year}

#### GET
##### Summary:

Get the country info with a specific year

##### Description:

Year information for all the categories for the given country id.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| countryId | path | Country ID | Yes | string |
| year | path | Search year for the country | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Country info year wise, if exists |
| 400 | Bad user input in params or query |
| 404 | Country ID/Year does not exists! |
| 500 | Internal Server Error! |

### /country/{countryId}/time/start-year

#### GET
##### Summary:

Starting year - Info

##### Description:

Info about the starting year of a country along with values and their respective categories

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| countryId | path | Country ID | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfull list of all countries with their available category list |
| 400 | Bad user input in params or query |
| 404 | Country ID does not exists! |
| 500 | Internal Server Error! |

### /country/{countryId}/time/end-year

#### GET
##### Summary:

Ending year - Info

##### Description:

Info about the ending year of a country along with values and their respective categories

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| countryId | path | Country ID | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfull list of all countries with their available category list |
| 400 | Bad user input in params or query |
| 404 | Country ID does not exists! |
| 500 | Internal Server Error! |

### /country/{countryId}/time/start-and-end-year

#### GET
##### Summary:

Starting and Ending year - Info

##### Description:

Info about the starting and ending year of a country along with values and their respective categories

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| countryId | path | Country ID | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfull list of all countries with their available category list |
| 400 | Bad user input in params or query |
| 404 | Country ID does not exists! |
| 500 | Internal Server Error! |

### /country/{countryId}/time/all-years

#### GET
##### Summary:

All years - Info

##### Description:

Info about all the years of a country along with values and their respective categories

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| countryId | path | Country ID | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfull list of all countries with their available category list |
| 400 | Bad user input in params or query |
| 404 | Country ID does not exists! |
| 500 | Internal Server Error! |

### /country/{countryId}/time/start-year/q

#### GET
##### Summary:

Starting year - Info (Filtered)

##### Description:

Info about the starting year of a country along with values and their respective categories, with the given parameters.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| countryId | path | Country ID | Yes | string |
| key | query | Keywords for the search | Yes | [ string ] |
| operationType | query | <b>AND</b> search returns a result only if all the keywords are present in the category.<br/><br/> <b>OR</b> search returns multiple or single result even if a single instance of the key is found the category. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfull list of all the entries matching the given parameters for the starting year. |
| 400 | Bad user input in params or query |
| 404 | Country ID/(Year/Years info) does not exists! |
| 500 | Internal Server Error! |

### /country/{countryId}/time/end-year/q

#### GET
##### Summary:

Ending year - Info (Filtered)

##### Description:

Info about the ending year of a country along with values and their respective categories, with the given parameters.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| countryId | path | Country ID | Yes | string |
| key | query | Keywords for the search | Yes | [ string ] |
| operationType | query | <b>AND</b> search returns a result only if all the keywords are present in the category.<br/><br/> <b>OR</b> search returns multiple or single result even if a single instance of the key is found the category. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfull list of all the entries matching the given parameters for the ending year. |
| 400 | Bad user input in params or query |
| 404 | Country ID/(Year/Years info) does not exists! |
| 500 | Internal Server Error! |

### /country/{countryId}/time/start-and-end-year/q

#### GET
##### Summary:

Starting and Ending year - Info (Filtered)

##### Description:

Info about the starting and ending year of a country along with values and their respective categories, with the given parameters.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| countryId | path | Country ID | Yes | string |
| key | query | Keywords for the search | Yes | [ string ] |
| operationType | query | <b>AND</b> search returns a result only if all the keywords are present in the category.<br/><br/> <b>OR</b> search returns multiple or single result even if a single instance of the key is found the category. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfull list of all the entries matching the given parameters for the starting and ending year. |
| 400 | Bad user input in params or query |
| 404 | Country ID/(Year/Years info) does not exists! |
| 500 | Internal Server Error! |

### /country/{countryId}/time/all-years/q

#### GET
##### Summary:

All years - Info (Filtered)

##### Description:

Info about all the years of a country along with values and their respective categories, with the given parameters.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| countryId | path | Country ID | Yes | string |
| key | query | Keywords for the search | Yes | [ string ] |
| operationType | query | <b>AND</b> search returns a result only if all the keywords are present in the category.<br/><br/> <b>OR</b> search returns multiple or single result even if a single instance of the key is found the category. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfull list of all the entries matching the given parameters for all the years. |
| 400 | Bad user input in params or query |
| 404 | Country ID/(Year/Years info) does not exists! |
| 500 | Internal Server Error! |

### Models


#### Countries

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| Countries | array |  |  |

#### Country

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| _id | string |  | Yes |
| countryName | string |  | Yes |
| startYear | integer |  | Yes |
| endYear | integer |  | Yes |

#### Country404Schema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string |  | No |

#### BadInputSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| errMessage | string |  | No |

#### InternalServerErrorSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| errMessage | string |  | No |

#### CountryInfo

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| _id | string |  | No |
| countryName | string |  | No |
| startYear | integer |  | No |
| endYear | integer |  | No |
| categories | [ string ] |  | No |

#### YearInfoSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| year | integer |  | No |
| categories | [ object ] |  | No |

#### CountryInfoYearValues

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| _id | string |  | No |
| countryName | string |  | No |

#### StartYearValues

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| StartYearValues |  |  |  |

#### EndYearValues

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| EndYearValues |  |  |  |

#### StartAndEndYearSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| StartAndEndYearSchema |  |  |  |

#### AllYearsSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| AllYearsSchema |  |  |  |

#### KeyList

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| KeyList | array |  |  |

#### FilteredRecords

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| FilteredRecords | array |  |  |

#### FilteredRecords404

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string |  | No |
| operationType | string |  | No |

#### YearInfoFiltered

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| year | integer |  | No |
| keys | [KeyList](#keylist) |  | No |
| filteredRecords |  |  | No |

#### StartYearInfoFilteredSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| StartYearInfoFilteredSchema |  |  |  |

#### EndYearInfoFilteredSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| EndYearInfoFilteredSchema |  |  |  |

#### StartAndEndYearInfoFilteredSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| StartAndEndYearInfoFilteredSchema |  |  |  |

#### AllYearsInfoFilteredSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| AllYearsInfoFilteredSchema |  |  |  |

#### SpecificYearInfoFound

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| year | integer |  | No |
| categories | [FilteredRecords](#filteredrecords) |  | No |

#### SpecificYearInfo404

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| year | integer |  | No |
| message | string |  | No |

#### SpecificYearSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| SpecificYearSchema |  |  |  |