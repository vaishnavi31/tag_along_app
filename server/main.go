package main

import (
    "fmt"
    "github.com/gin-gonic/gin"
)


func main() {
    fmt.Println("Welcome to Tag Along App")
    router := gin.Default()

    userRouter := router.Group("/users")
    {
        userRouter.GET("", getUsers)
        userRouter.GET("/:userID", getUserByID)
        userRouter.POST("", createUser)
        userRouter.PUT("", updateUser)
        userRouter.GET("/validate", validateUserForLogin)
    }

    groupRouter := router.Group("/groups")
    {
        groupRouter.Use(validateUserMiddleWare())
        groupRouter.GET("", getAllPublicGroups)
        groupRouter.GET("/:groupID", getGroupByID)
        groupRouter.GET("/user/:userID", getGroupsByUserID)
        groupRouter.POST("", createGroup)
        groupRouter.PUT("", updateGroup)
    }
    
    eventRouter := router.Group("/events")
    {
        eventRouter.Use(validateGroupMiddleWare())
        eventRouter.Use(validateUserMiddleWare())
        eventRouter.GET("/:eventID", getEventByID)
        eventRouter.GET("/group/:groupID", getEventByGroupID)
        eventRouter.GET("/user/:userID", getEventByUserID)
        eventRouter.POST("", createEvent)
        eventRouter.PUT("", updateEvent)
    }

    createDefaultUsers()
    createDefaultGroups()
    createDefaultEvents()
    router.Run()
}
