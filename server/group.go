package main

import (
    "errors"
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

type Group struct {
    ID          string      `json:"id"`
    Name        string      `json:"name"`
    Description string      `json:"description"`
    IsPublic    bool        `json:"isPublic"`
    CreatedBy   string      `json:"createdBy"`
    UserList    []string    `json:"userList"`
    EventList   []string    `json:"eventList"`
}

var groups = make([]Group, 0)

func createDefaultGroups() {
    defaultGroups := []Group{
        {
            ID:          uuid.New().String(),
            Name:        "SPL - Spring 2023",
            Description: "A group to discuss about SPL subject. Open to any intellectual discussions about the subject",
            IsPublic:    true,
            CreatedBy:   users[0].ID,
            UserList:    []string{users[0].ID, users[1].ID, users[2].ID, users[3].ID},
            EventList:   []string{},
        },
        {
            ID:          uuid.New().String(),
            Name:        "Coffee Addicts",
            Description: "A group to hang out and share coffee breaks. General Guidelines:\n"+
            "1. Casual Coffee Meet-Ups \n"+
            "2. No course work related discussions \n" +
            "3. No black coffee!",
            IsPublic:    false,
            CreatedBy:   users[1].ID,
            UserList:    []string{users[1].ID, users[2].ID, users[3].ID},
            EventList:   []string{},
        },
    }
    groups = append(groups, defaultGroups...)
}


func getAllPublicGroups(c *gin.Context) {
    publicGroups := make([]Group, 0)
    i := 0
    for i < len(groups) {
        if groups[i].IsPublic == true {
            publicGroups = append(publicGroups, groups[i])
        }
        i++
    }
    c.JSON(http.StatusOK, publicGroups)
}

func getGroupByID(c *gin.Context) {
    groupID := c.Param("groupID")
    group, err := getGroupByGroupID(groupID)

    if err != nil {
        c.IndentedJSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.IndentedJSON(http.StatusOK, group)
}

func getGroupsByUserID(c *gin.Context) {
    filteredGroups := make([]Group, 0)
    userID := c.Param("userID")
    for _, group := range groups {
        if group.CreatedBy == userID || userExistInUserList(group.UserList, userID) {
            filteredGroups = append(filteredGroups, group)
        }
    }
    c.JSON(http.StatusOK, filteredGroups)
}

func createGroup(c *gin.Context) {
    var newGroup Group
    
    if err := c.ShouldBindJSON(&newGroup); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var validUserIDs []string
    for _, userEmail := range newGroup.UserList {
        user, err := getUserByEmail(userEmail)
        if err != nil {
            continue
        }
        validUserIDs = append(validUserIDs, user.ID)
    }
    newGroup.UserList = validUserIDs
    newGroup.ID = uuid.New().String()
    groups = append(groups, newGroup)
    c.JSON(http.StatusCreated, newGroup)
}

func updateGroup(c *gin.Context) {
    var updatedGroup Group
    if err := c.ShouldBindJSON(&updatedGroup); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    for i, group := range groups {
        if group.ID == updatedGroup.ID {
            groups[i] = updatedGroup
            c.JSON(http.StatusOK, groups[i])
            return
        }
    }

    c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
}

func getGroupByGroupID(groupID string) (Group, error) {
    for _, group := range groups {
        if group.ID == groupID {
            return group, nil
        }
    }
    return Group{}, errors.New("Group not found")
}

func userExistInUserList(userList []string, userID string) bool {
    for _, id := range userList {
        if id == userID {
            return true
        }
    }
    return false
}

func validateGroupMiddleWare() gin.HandlerFunc {
    return func(c *gin.Context) {
        groupID := c.Param("groupID")
        if groupID == "" || validateGroup(groupID) {
            c.Next()
        } else {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Group not found"})
        }
    }
}

func validateGroup(groupID string) bool {
    isValidGroup := false
    for _, group := range groups {
        if group.ID == groupID {
            isValidGroup = true
            break
        }
    }
    return isValidGroup
}