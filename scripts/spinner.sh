#!/bin/bash

spinner() {
    local PROC="$1"
    local str="$2"
    local delay="0.1"
    tput civis # hide cursor
    while [ -d /proc/$PROC ]; do
        printf '\033[s\033[u⣾ %s\033[u' "$str"
        sleep "$delay"
        printf '\033[s\033[u⣽ %s\033[u' "$str"
        sleep "$delay"
        printf '\033[s\033[u⣻ %s\033[u' "$str"
        sleep "$delay"
        printf '\033[s\033[u⢿ %s\033[u' "$str"
        sleep "$delay"
        printf '\033[s\033[u⡿ %s\033[u' "$str"
        sleep "$delay"
        printf '\033[s\033[u⣟ %s\033[u' "$str"
        sleep "$delay"
        printf '\033[s\033[u⣯ %s\033[u' "$str"
        sleep "$delay"
        printf '\033[s\033[u⣷ %s\033[u' "$str"
        sleep "$delay"
    done
    printf '\033[s\033[u%*s\033[u' $((${#str} + 6)) " " # return to normal
    tput cnorm                                                 # restore cursor
    return 0
}
