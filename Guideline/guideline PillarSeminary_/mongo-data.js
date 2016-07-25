// for students table 
/* 1 */ 
{
    "_id" : "000002",
    "email" : "user2@domain.com",
    "firstName" : "Janet",
    "middleName" : "E",
    "lastName" : "Smith",
    "gender" : "F",
    "birthDate" : "1998-04-20",
    "phoneNumber" : "555-555-5555",
    "addressLine1" : "54321 Main Ln.",
    "city" : "Some City",
    "state" : "CO",
    "zipCode" : "55555",
    "undergraduateDegrees" : [ 
        {
            "institutionName" : "University of Minnesota",
            "degree" : "B.S.",
            "field" : "Math",
            "graduationDate" : "2014-01-22"
        }
    ],
    "graduateDegrees" : [ 
        {
            "institutionName" : "University of Minnesota",
            "degree" : "M.S.",
            "field" : "Math",
            "graduationDate" : "2016-01-22"
        }
    ],
    "ministries" : [ 
        {
            "ministryName" : "St. Gerard Church",
            "ministrySupervisor" : "Mr. Smith",
            "ministrySupervisorTitle" : "Business Administrator",
            "ministrySupervisorPhoneNumber" : "763-424-7770",
            "ministryDescription" : "Served in the name of God"
        }
    ],
    "references" : [ 
        {
            "firstName" : "Bob",
            "middleName" : "B",
            "lastName" : "Smith",
            "email" : "bob@domain.com",
            "phoneNumber" : "222-333-4444",
            "relationship" : "Father"
        }
    ],
    "graduationDate" : "2018-01-22",
    "applicationDate" : "2016-05-01",
    "acceptanceNotificationDate" : "2016-05-30",
    "emergencyContacts" : [ 
        {
            "firstName" : "Bob",
            "middleName" : "B",
            "lastName" : "Smith",
            "email" : "bob@domain.com",
            "phoneNumber" : "222-333-4444",
            "relationship" : "Father"
        }
    ]
}

/* 2 */
{
    "_id" : "000001",
    "email" : "user2@domain.com",
    "firstName" : "Janet",
    "middleName" : "E",
    "lastName" : "Smith",
    "gender" : "F",
    "birthDate" : "1998-04-20",
    "phoneNumber" : "555-555-5555",
    "addressLine1" : "54321 Main Ln.",
    "city" : "Some City",
    "state" : "CO",
    "zipCode" : "55555",
    "undergraduateDegrees" : [ 
        {
            "institutionName" : "University of Minnesota",
            "degree" : "B.S.",
            "field" : "Math",
            "graduationDate" : "2014-01-22"
        }
    ],
    "graduateDegrees" : [ 
        {
            "institutionName" : "University of Minnesota",
            "degree" : "M.S.",
            "field" : "Math",
            "graduationDate" : "2016-01-22"
        }
    ],
    "ministries" : [ 
        {
            "ministryName" : "St. Gerard Church",
            "ministrySupervisor" : "Mr. Smith",
            "ministrySupervisorTitle" : "Business Administrator",
            "ministrySupervisorPhoneNumber" : "763-424-7770",
            "ministryDescription" : "Served in the name of God"
        }
    ],
    "references" : [ 
        {
            "firstName" : "Bob",
            "middleName" : "B",
            "lastName" : "Smith",
            "email" : "bob@domain.com",
            "phoneNumber" : "222-333-4444",
            "relationship" : "Father"
        }
    ],
    "graduationDate" : "2018-01-22",
    "applicationDate" : "2016-05-01",
    "acceptanceNotificationDate" : "2016-05-30",
    "emergencyContacts" : [ 
        {
            "firstName" : "Bob",
            "middleName" : "B",
            "lastName" : "Smith",
            "email" : "bob@domain.com",
            "phoneNumber" : "222-333-4444",
            "relationship" : "Father"
        }
    ]
}

/*ministries collection */
/* 1 */
{
    "_id" : "St. Gerard Church",
    "phoneNumber" : "763-424-7770",
    "addressLine1" : "9600 Regent Ave N",
    "city" : "Brooklyn Park",
    "state" : "MN",
    "zipCode" : "55443",
    "country" : "USA"
}

/* instituation collection*/
/* 1 */
{
    "_id" : "Metropolitan State University",
    "phoneNumber" : "651-555-2222",
    "addressLine1" : "123 Main St",
    "city" : "St. Paul",
    "state" : "MN",
    "zipCode" : "55555"
}

/* 2 */
{
    "_id" : "University of Minnesota",
    "phoneNumber" : "512-222-2222",
    "addressLine1" : "222 University Ave",
    "city" : "Minneapolis",
    "state" : "MN",
    "zipCode" : "55412"
}

/* groups collection */

/* 1 */
{
    "_id" : "Administrators",
    "description" : "Administrators Group"
}

/* 2 */
{
    "_id" : "Faculty",
    "description" : "Faculty Group"
}

/* 3 */
{
    "_id" : "Office",
    "description" : "Office Group"
}

/* 4 */
{
    "_id" : "Student",
    "description" : "Student Group"
}