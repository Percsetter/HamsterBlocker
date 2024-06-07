#!/bin/bash

######################################################
read -p "Enter your bot token: " token
mkdir private && echo "TOKEN=${token}" >> private/.env