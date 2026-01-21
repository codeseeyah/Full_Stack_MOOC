sequenceDiagram
    participant browser
    participant server

    Note right of browser: The browser sends the new note to the server to update the JSON data

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: HTML status 201 (Created)
    deactivate server

    Note right of browser: The browser executes the event handler which renders the new note without fetching data from the server