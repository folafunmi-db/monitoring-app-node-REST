# An UPTIME monitoring app

An app that monitors a URL and receives alerts when those resources 'go down' or 'come back up'. Built using NodeJS.

## To create the openssl certificate use

Firstly, create a https folder and navigate into it. Then:

1. Create the openssl.cnf file at `C:\ci\openssl_1581353098519\_h_env\Library\`
2. Set the configuration file using the command `set OPENSSL_CONF=C:\ci\openssl_1581353098519\_h_env\Library\openssl.cnf`
3. Paste the following into openssl.cnf

```
\#

\# OpenSSL configuration file.

\#

\# Establish working directory.

dir = .

[ ca ]
default_ca = CA_default

[ CA_default ]
serial = $dir/serial
database                = $dir/certindex.txt
new_certs_dir = $dir/certs
certificate             = $dir/cacert.pem
private_key = \$dir/private/cakey.pem
default_days = 365
default_md = md5
preserve = no
email_in_dn = no
nameopt = default_ca
certopt = default_ca
policy = policy_match

[ policy_match ]
countryName = match
stateOrProvinceName = match
organizationName = match
organizationalUnitName = optional
commonName = supplied
emailAddress = optional

[ req ]
default_bits = 1024 # Size of keys
default_keyfile = key.pem # name of generated keys
default_md = md5 # message digest algorithm
string_mask = nombstr # permitted characters
distinguished_name = req_distinguished_name
req_extensions = v3_req

[ req_distinguished_name ]

\# Variable name Prompt string

\#------------------------- ----------------------------------
0.organizationName = Organization Name (company)
organizationalUnitName = Organizational Unit Name (department, division)
emailAddress = Email Address
emailAddress_max = 40
localityName = Locality Name (city, district)
stateOrProvinceName = State or Province Name (full name)
countryName = Country Name (2 letter code)
countryName_min = 2
countryName_max = 2
commonName = Common Name (hostname, IP, or your name)
commonName_max = 64

\# Default values for the above, for consistency and less typing.

\# Variable name Value

\#------------------------ ------------------------------
0.organizationName_default = My Company
localityName_default = My Town
stateOrProvinceName_default = State or Providence
countryName_default = US

[ v3_ca ]
basicConstraints = CA:TRUE
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer:always

[ v3_req ]
basicConstraints = CA:FALSE
subjectKeyIdentifier = hash

```

4. With Git installed, run the command `openssl req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 3650 -out certificate.pem`
