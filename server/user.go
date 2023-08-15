package main

import (
    "time"
    "fmt"
    "net/http"
    "errors"

    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

type User struct {
    ID          string `json:"id"`
    Name        string `json:"name"`
    Email       string `json:"email"`
    Gender      string `json:"gender"`
    DateOfBirth time.Time `json:"dateOfBirth"`
    Password    string `json:"password"`
}

var users = make([]User, 0)

func createDefaultUsers() {
    dob1, err1 := time.Parse(time.RFC3339, "1997-07-31T00:00:00Z")
    dob2, err2 := time.Parse(time.RFC3339, "1998-01-21T00:00:00Z")
    dob3, err3 := time.Parse(time.RFC3339, "1996-03-17T00:00:00Z")
    dob4, err4 := time.Parse(time.RFC3339, "1995-08-21T00:00:00Z")
    dob5, err5 := time.Parse(time.RFC3339, "1995-01-13T00:00:00Z")
    if err1 != nil || err2 != nil || err3 != nil || err4 != nil || err5 != nil {
        fmt.Println("Error parsing date string")
        return
    }
    newUser1:= User{
        ID: uuid.New().String(),
        Name: "Prasenjeet Paul",
        Email: "ppaul8@uncc.edu",
        Gender: "M",
        DateOfBirth: dob1,
        Password: "123456",
    }
    newUser2:= User{
        ID: uuid.New().String(),
        Name: "Srujitha Gali",
        Email: "lgali@uncc.edu",
        Gender: "F",
        DateOfBirth: dob2,
        Password: "123456",
    }
    newUser3:= User{
        ID: uuid.New().String(),
        Name: "Vaishnavi",
        Email: "vbaiken@uncc.edu",
        Gender: "F",
        DateOfBirth: dob3,
        Password: "123456",
    }
    newUser4:= User{
        ID: uuid.New().String(),
        Name: "Poornima",
        Email: "ppulakan@uncc.edu",
        Gender: "F",
        DateOfBirth: dob4,
        Password: "123456",
    }
    newUser5:= User{
        ID: uuid.New().String(),
        Name: "Vasu Tiwari",
        Email: "vtiwari2@uncc.edu",
        Gender: "M",
        DateOfBirth: dob5,
        Password: "123456",
    }
    users = append(users, newUser1)
    users = append(users, newUser2)
    users = append(users, newUser3)
    users = append(users, newUser4)
    users = append(users, newUser5)
}

func getUsers(c *gin.Context) {
    c.JSON(http.StatusOK, users)
}

func getUserByID(c *gin.Context) {
    userID := c.Param("userID")
    for _, user := range users {
        if user.ID == userID {
            c.JSON(http.StatusOK, user)
            return
        }
    }
    c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
}


func getUserByEmail(email string) (*User, error) {
    for _, user := range users {
        if user.Email == email {
            return &user, nil
        }
    }
    return nil, errors.New("User not found")
}

func validateUserForLogin(c *gin.Context) {
    userEmail := c.Query("userEmail")
    password := c.Query("password")
    fmt.Println(userEmail, password)
    for _, user := range users {
        if user.Email == userEmail && user.Password == password {
            c.JSON(http.StatusOK, user)
            return
        }
    }
    c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
}


func createUser(c *gin.Context) {
    var newUser User
    
    if err := c.ShouldBindJSON(&newUser); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if newUser.Gender != "M" && newUser.Gender != "F" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Gender type"})
        return
    }

    if validateUser(newUser.Email) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User email already exist!"})
        return
    }

    newUser.ID = uuid.New().String()
    users = append(users, newUser)
    c.JSON(http.StatusCreated, newUser)
}

func updateUser(c *gin.Context) {
    var updatedUser User
    if err := c.ShouldBindJSON(&updatedUser); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    for i, user := range users {
        if user.ID == updatedUser.ID {
            users[i].Name = updatedUser.Name
            users[i].Email = updatedUser.Email
            users[i].Gender = updatedUser.Gender
            users[i].DateOfBirth = updatedUser.DateOfBirth
            c.JSON(http.StatusOK, users[i])
            return
        }
    }

    c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
}

func validateUserMiddleWare() gin.HandlerFunc {
    return func(c *gin.Context) {
        userID := c.Param("userID")
        if userID == "" || validateUser(userID) {
            c.Next()
        } else {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
        }
    }
}

func validateUser(userID string) bool {
    isValidUser := false
    for _, user := range users {
        if user.ID == userID {
            isValidUser = true
            break
        }
        if user.Email == userID {
            isValidUser = true
            break
        }
    }
    return isValidUser
}