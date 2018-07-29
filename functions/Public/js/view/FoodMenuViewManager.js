function SetMenuImage(type, url) {
    $("#" + type + "Img").attr("src", url)
}

function SetLastUploader(type, uploader) {
    $("#" + type + "LastUploader").text(uploader)
}

function SetLastUpdateDateTime(type, uploadDateTime) {
    $("#" + type + "LastUploadDateTime").text(uploadDateTime)
}

function HideUploadForm(type) {
    $("#" + type + "UploadMenuForm").hide()
}

function ShowUploadForm(type) {
    $("#" + type + "UploadMenuForm").show()
}

function DisableEnableSubmit(type, status) {
    $("#" + type + "Submit").prop("disabled", status)
}