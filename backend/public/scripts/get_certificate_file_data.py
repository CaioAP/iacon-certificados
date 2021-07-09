import sys
import json
import traceback
from datetime import datetime
import OpenSSL.crypto
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.serialization import pkcs12

def read_pfx_file(file_path):
  with open(file_path, 'rb') as f_pfx:
    pfx_file = f_pfx.read()
  
  return pfx_file

def get_p12_content(pfx_file, password):
  # return pkcs12.load_key_and_certificates(pfx_file, password)
  return OpenSSL.crypto.load_pkcs12(pfx_file, password)

def write_pem_files(p12):
  privatekey = p12.get_privatekey()
  certificate = p12.get_certificate()
  filetype_pem = OpenSSL.crypto.FILETYPE_PEM

  with open('cert.key.pem', 'wb') as f:
    f.write(OpenSSL.crypto.dump_privatekey(filetype_pem, privatekey))

  with open('cert.crt.pem', 'wb') as f:
    f.write(OpenSSL.crypto.dump_certificate(filetype_pem, certificate))

def read_cas(p12):
  filetype_pem = OpenSSL.crypto.FILETYPE_PEM
  ca_certificates = p12.get_ca_certificates()
  certificates_list = []

  if not ca_certificates is None:
    for certificate in ca_certificates:
      certificates_list.append(OpenSSL.crypto.dump_certificate(filetype_pem, certificate).decode('utf8'))

  return certificates_list

def byteDictToDict(byteDict):
  dictionary = {}

  for key in byteDict:
    dictionary[key.decode("utf8")] = byteDict[key].decode("utf8")
  
  return dictionary

def get_formatted_date(dateString):
  date = datetime.strptime(dateString, '%Y%m%d%H%M%SZ')
  return datetime.strftime(date, '%Y-%m-%d %H:%M:%S')

def handle_pfx(file_path, password):
  try:
    pfx_file = read_pfx_file(file_path)
    
    p12 = get_p12_content(pfx_file, password)

    filetype_pem = OpenSSL.crypto.FILETYPE_PEM
    p12_privatekey = p12.get_privatekey()
    p12_certificate = p12.get_certificate()
    certificate_issuer = p12_certificate.get_issuer()
    certificate_subject = p12_certificate.get_subject()
    certificate_notbefore = p12_certificate.get_notBefore().decode('utf-8')
    certificate_notafter = p12_certificate.get_notAfter().decode('utf-8')
    pem_data = OpenSSL.crypto.dump_certificate(filetype_pem, p12_certificate).decode('utf-8')

    data = dict(
      key = OpenSSL.crypto.dump_privatekey(filetype_pem, p12_privatekey).decode('utf-8'),
      pem = pem_data,
      ca = read_cas(p12),
      # expiration = x509.load_pem_x509_certificate(pem_data, default_backend()).not_valid_after,
      emissor = byteDictToDict(dict(certificate_issuer.get_components())),
      proprietario = byteDictToDict(dict(certificate_subject.get_components())),
      numero_serie = p12_certificate.get_serial_number(),
      inicio_validade = get_formatted_date(certificate_notbefore),
      fim_validade = get_formatted_date(certificate_notafter),
    )

    # write_pem_files(p12)

    print(json.dumps(data))

  except Exception:
    traceback.print_exc()

if __name__ == "__main__":
  try:
    args = sys.argv
    file_path = args[1]
    password = bytes(args[2], 'utf-8')

    handle_pfx(file_path, password)
  
  except Exception:
    traceback.print_exc()