                                                    ***********************
                                                        FIELD GENERATOR         
                                                    ***********************

* In TruPacta we needed a dynamic field generator which generates fields depending upon the response coming from the server.
* Response of the server throws fields in the response,

 e.g [{
    title: "ABC",
    type: INPUT_STRING
    rules: {
        is_required: true/false
    }
    etc.....
}]

* Catering these field types:
    - String
    - Number
    - Dropdown
    - Boolean (Switch Buttons)
    - Date
    - Radio
    - Checkbox
    - Attachment
    - Textarea
    - Table