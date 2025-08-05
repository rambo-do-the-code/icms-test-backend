const {v4: uuidv4} = require('uuid');
require('dotenv').config();

const ENVIRONMENT = process.env.ENVIRONMENT || 'prod';

const dev = [
    {
        "paramsData": {
            "resourceId": 4260,
            "user":  uuidv4(),
            "sessionId":  uuidv4(),
            "mode": "test",
            "schoolId": "c8c50bb4-a039-4d01-ab4d-8f33e19f61fe"
        },
        "type": "SCHOOL",
        "sessionExpireTimeMinute": 1000
    },
    {
        "resourceName": uuidv4(),
        "theme": "apollo",
        "pages": [
            {
                "pageName": "Basic True/False",
                "questionRawIds": [
                    11488,
                    11489,
                    11490,
                    11491,
                    11492,
                    11493,
                    11494,
                    11495
                ]
            },
            {
                "pageName": "Basic Multiple Choice",
                "questionRawIds": [
                    11464,
                    11465,
                    11466,
                    11467,
                    11468,
                    11469,
                    11470,
                    11471
                ]
            },
            {
                "pageName": "Basic Drag-and-Drop Matching",
                "questionRawIds": [
                    11496
                ]
            }
        ]
    },
    {
        "actor": null,
        "verb": {
            "id": "http://adlnet.gov/expapi/verbs/experienced",
            "display": {
                "en-US": "experienced"
            }
        },
        "object": {
            "objectType": "Activity",
            "id": "https://icms-cdn.schoolux.ai/content/authoring/tenant/66b08b7da083da3b177eea0d/course/68353862b1ce6e7e54858877/version/05b6ca78-7e1d-4dc9-8464-15c77efcaa33/index.html#/id/68353862b1ce6e7e54858879",
            "definition": {
                "name": {
                    "en": "Basic True/False"
                },
                "type": "http://adlnet.gov/expapi/activities/lesson"
            }
        },
        "pageId": "68353862b1ce6e7e54858879",
        "context": {
            "contextActivities": {
                "grouping": [
                    {
                        "objectType": "Activity",
                        "id": "https://icms-cdn.schoolux.ai/content/authoring/tenant/66b08b7da083da3b177eea0d/course/68353862b1ce6e7e54858877/version/05b6ca78-7e1d-4dc9-8464-15c77efcaa33/index.html",
                        "definition": {
                            "type": "http://adlnet.gov/expapi/activities/course",
                            "name": {
                                "en": "Lesson 1.1"
                            },
                            "description": {
                                "en": ""
                            }
                        }
                    }
                ]
            }
        },
        "id": "f0d61af1-9793-4008-b90c-269fa805b560"
    }

];

const prod = [
    {
        "paramsData": {
            "resourceId": 431,
            "user":  uuidv4(),
            "sessionId":  uuidv4(),
            "mode": "test",
            "schoolId": "74c02850-2e03-4418-b928-aa238682e658"
        },
        "type": "SCHOOL",
        "sessionExpireTimeMinute": 1440
    },
    {
        "resourceName": uuidv4(),
        "theme": "apollo",
        "pages": [
            {
                "pageName": "Basic True/False",
                "questionRawIds": [
                    2161,
                    2160,
                    2159,
                    2158,
                    2157,
                    2156,
                    2155,
                    2154
                ]
            },
            {
                "pageName": "Basic Multiple Choice",
                "questionRawIds": [
                    2137,
                    2136,
                    2135,
                    2134,
                    2133,
                    2132,
                    2131,
                    2130
                ]
            },
            {
                "pageName": "Basic Drag-and-Drop Matching",
                "questionRawIds": [
                    2162
                ]
            }
        ]
    },
    {
        "actor": null,
        "verb": {
            "id": "http://adlnet.gov/expapi/verbs/answered",
            "display": {
                "en-US": "answered"
            }
        },
        "object": {
            "objectType": "Activity",
            "id": "https://cdn-icms.apollo.edu.vn/content/authoring/tenant/66b08b7da083da3b177eea0d/course/680774179db04c01b8e2e1ea/version/dab5cbf5-1a05-4d36-a0b9-f04d5b2f1b4b/index.html#/id/680774179db04c01b8e2e1f2",
            "definition": {
                "name": {
                    "en": "True or False"
                },
                "description": {
                    "en": "Ben has a football."
                },
                "type": "http://adlnet.gov/expapi/activities/question",
                "interactionType": "choice",
                "correctResponsesPattern": [
                    "1"
                ],
                "choices": [
                    {
                        "id": "1",
                        "description": {
                            "en": "True"
                        }
                    },
                    {
                        "id": "2",
                        "description": {
                            "en": "False"
                        }
                    }
                ]
            }
        },
        "result": {
            "score": {
                "raw": 1
            },
            "success": true,
            "completion": true,
            "response": "1"
        },
        "pageId": "680774179db04c01b8e2e1ec",
        "context": {
            "contextActivities": {
                "grouping": [
                    {
                        "objectType": "Activity",
                        "id": "https://cdn-icms.apollo.edu.vn/content/authoring/tenant/66b08b7da083da3b177eea0d/course/680774179db04c01b8e2e1ea/version/dab5cbf5-1a05-4d36-a0b9-f04d5b2f1b4b/index.html",
                        "definition": {
                            "type": "http://adlnet.gov/expapi/activities/course",
                            "name": {
                                "en": "Lesson 6.1 "
                            },
                            "description": {
                                "en": ""
                            }
                        }
                    },
                    {
                        "objectType": "Activity",
                        "id": "https://cdn-icms.apollo.edu.vn/content/authoring/tenant/66b08b7da083da3b177eea0d/course/680774179db04c01b8e2e1ea/version/dab5cbf5-1a05-4d36-a0b9-f04d5b2f1b4b/index.html#/id/680774179db04c01b8e2e1ec",
                        "definition": {
                            "name": {
                                "en": "reading true false"
                            },
                            "type": "http://adlnet.gov/expapi/activities/lesson"
                        }
                    }
                ]
            }
        },
        "id": "cc763ace-1183-454f-a17d-6bf0e360c886"
    }

]

module.exports = {
    dataTest: ENVIRONMENT === 'dev' ? dev : prod
};
