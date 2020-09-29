#!/bin/bash

export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_NONPROD_ADMIN
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY_NONPROD_ADMIN
# AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are now available for serverless to use
serverless deploy --verbose