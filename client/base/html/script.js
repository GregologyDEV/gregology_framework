/*
if ("alt" in window) {
    $(document).ready(function() {
        alt.on("update_char_info", (player_char_fullname, playerScriptID, player_cash, player_bank) => {
            $("#active_char_name").text(player_char_fullname);
        });
    });
}
*/

if ("alt" in window) {
    alt.on("update_char_info", (player_uID, player_char_fullname, player_cash, player_bank) => {
        $("#user_id").text(player_uID);
        $("#active_char_name").text(player_char_fullname);
        $("#char_cash").text(player_cash);
        $("#char_bank").text(player_bank);
    });
}