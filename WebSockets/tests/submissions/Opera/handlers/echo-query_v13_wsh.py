#!/usr/bin/python

from mod_pywebsocket import msgutil, util

def web_socket_do_extra_handshake(request):
    pass

def web_socket_transfer_data(request):
    while True:
 	msgutil.send_message(request, request.ws_resource.split('?', 1)[1])
	return
