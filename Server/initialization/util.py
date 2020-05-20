def get_user(e_mail):
    """
    This function will take every e-mail address and put it in this fashion: 'name@domain'
    in which 'name' refers to everything without a dot before the @ symbol and 'domain' refers to
    the domain without the .com/.br/.ca/etc endings.
    """
    splitted_mail = e_mail.split(".")
    cur_mail = ""
    for part in splitted_mail:
        if "@" in part:
            cur_mail += part
            break
        else:
            cur_mail += part
    return cur_mail