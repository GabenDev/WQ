curl -X POST -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYTI0YWE5OS1jY2Q3LTRiY2ItYTZmMS00NTUwOTRmMzc4OGYifQ.qMwuWmSeFJG8aFcBjVaExj101MkL-NDQABgCmPJ7UqI" -H "Content-Type: application/json" -d '{
    "tokens": ["feba7KFhspI:APA91bEtpT8Dq2nthohA4In-qbHci7DHyQLZEtLTcZzPk7TYGXO_iNShVF0TXpuq0G145iGYPwPwwlQPmEeuKgc3oF9NKR8jJSzFUiNqImMojPGjEYvrK0UxOvyMPJcihhJOYcJkmmvq"],
    "profile": "dev",
    "notification": {
        "message": "This is my demo push!"
    }
}' "https://api.ionic.io/push/notifications"
