package main

import (
    "time"
    "net/http"
    "fmt"

    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

type Event struct {
    ID                      string      `json:"id"`
    Name                    string      `json:"name"`
    Description             string      `json:"description"`
    GroupID                 string      `json:"groupId"`
    CreatedBy               string      `json:"createdBy"`
    StartTime               time.Time   `json:"startTime"`
    Duration                int         `json:"duration"`
    InvitedUsers            []string    `json:"invitedUsers"`
    AcceptedUsers           []string    `json:"acceptedUsers"`
    AcceptanceRatio         float64     `json:"acceptanceRatio"`
}

var events = make([]Event, 0)

func createDefaultEvents() {
    eventTime1, err1 := time.Parse(time.RFC3339, "2023-05-03T15:30:00Z")
    eventTime2, err2 := time.Parse(time.RFC3339, "2023-05-05T18:00:00Z")
    eventTime3, err3 := time.Parse(time.RFC3339, "2023-05-07T18:30:00Z")
    if err1 != nil || err2 != nil || err3 != nil {
        fmt.Println("Error parsing date string")
        return
    }
    defaultEvents := []Event{
        {
            ID:          uuid.New().String(),
            Name:        "SPL Final Project Discussion",
            Description: "Hi team, please join this event to discuss about the planning and roadmap of the project. It is mandatory to attend this event if you want to understand and provide inputs to the final project plan.",
            CreatedBy:   users[0].ID,
            GroupID:     groups[0].ID,
            StartTime:   eventTime1,
            Duration:    60,
            InvitedUsers:    []string{users[0].ID, users[1].ID, users[2].ID},
            AcceptedUsers:   []string{users[0].ID},
        },
        {
            ID:          uuid.New().String(),
            Name:        "Coffee Hangout",
            Description: "Just a casual hangout with friends. Dont forget to bring your fav coffee cup!",
            CreatedBy:   users[1].ID,
            GroupID:     groups[1].ID,
            StartTime:   eventTime2,
            Duration:    30,
            InvitedUsers:    []string{users[1].ID, users[2].ID, users[3].ID},
            AcceptedUsers:   []string{users[1].ID, users[2].ID},
        },
        {
            ID:          uuid.New().String(),
            Name:        "Trying Peppermint Mocha",
            Description: "Hey all, I will be experimenting and trying the infamous Peppermint Mocha. Tag along if interested ;)",
            CreatedBy:   users[1].ID,
            GroupID:     groups[1].ID,
            StartTime:   eventTime3,
            Duration:    30,
            InvitedUsers:    []string{users[1].ID},
            AcceptedUsers:   []string{users[1].ID},
        },
    }
    events = append(events, defaultEvents...)
}

func getEventByID( c *gin.Context) {
    eventID := c.Param("eventID")
    for _, event := range events {
        if event.ID == eventID {
            c.JSON(http.StatusOK, event)
            return
        }
    }
    c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
}

func getEventByGroupID( c *gin.Context) {
    groupID := c.Param("groupID")
    filteredEvents := make([]Event, 0)
    for _, event := range events {
        if event.GroupID == groupID {
            filteredEvents = append(filteredEvents, event)
        }
    }
    c.JSON(http.StatusOK, filteredEvents)
}

func getEventByUserID( c *gin.Context) {
    userID := c.Param("userID")
    filteredEvents := make([]Event, 0)
    for _, event := range events {
        if userExistInUserList(event.InvitedUsers, userID) || userExistInUserList(event.AcceptedUsers, userID) {
            filteredEvents = append(filteredEvents, event)
        }
    }
    c.JSON(http.StatusOK, filteredEvents)
}

// TODO: validate user ids in invited/accepted users list before insert
func createEvent(c *gin.Context) {
    var newEvent Event
    
    if err := c.ShouldBindJSON(&newEvent); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var validInvitedUserIDs []string
    for _, userEmail := range newEvent.InvitedUsers {
        user, err := getUserByEmail(userEmail)
        if err != nil {
            continue
        }
        validInvitedUserIDs = append(validInvitedUserIDs, user.ID)
    }
    
    var validAcceptedUserIDs []string
    for _, userEmail := range newEvent.AcceptedUsers {
        user, err := getUserByEmail(userEmail)
        if err != nil {
            continue
        }
        validAcceptedUserIDs = append(validAcceptedUserIDs, user.ID)
    }

    newEvent.InvitedUsers = validInvitedUserIDs
    newEvent.AcceptedUsers = validAcceptedUserIDs
    newEvent.ID = uuid.New().String()
    events = append(events, newEvent)
    c.JSON(http.StatusCreated, newEvent)
}


func updateEvent(c *gin.Context) {
    var updatedEvent Event
    if err := c.ShouldBindJSON(&updatedEvent); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    for i, event := range events {
        if event.ID == updatedEvent.ID {
            events[i] = updatedEvent
            c.JSON(http.StatusOK, events[i])
            return
        }
    }

    c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
}
