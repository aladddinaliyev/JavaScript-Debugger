nano jsdebugger.sh


#!/bin/bash

frames=(
"   __      ___                 _____        _       _     _     _       "
"  / /___  / _ \\__   _____ _ _|  ___|__  __| | __ _| |__ | |__ (_)_ __  "
" / // _ \\| | | \\ \\ / / _ \\ '__| |_ / _ \\/ _\` |/ _\` | '_ \\| '_ \\| | '_ \\ "
"/ // (_) | |_| |\\ V /  __/ |  |  _|  __/ (_| | (_| | |_) | |_) | | | | |"
"\\_\\\\___/ \\___/  \\_/ \\___|_|  |_|  \\___|\\__,_|\\__,_|_.__/|_.__/|_|_| |_|"
"                      JavaScript Debugger                               "
)

while true; do
    # Frame 1 — яркий
    echo -e "\e[91m${frames[0]}\n${frames[1]}\n${frames[2]}\n${frames[3]}\n${frames[4]}\n${frames[5]}\e[0m"
    sleep 0.18
    clear

    # Frame 2 — тусклый
    echo -e "\e[31m${frames[0]}\n${frames[1]}\n${frames[2]}\n${frames[3]}\n${frames[4]}\n${frames[5]}\e[0m"
    sleep 0.18
    clear

    # Frame 3 — почти исчезает (эффект мигания)
    echo -e "\e[2m${frames[0]}\n${frames[1]}\n${frames[2]}\n${frames[3]}\n${frames[4]}\n${frames[5]}\e[0m"
    sleep 0.18
    clear
done
