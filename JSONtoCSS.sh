#!/bin/bash

read -p "File to read: " json
while IFS= read -r line
do
  sed -e 's/"//g' $json
done < $json > new.json
