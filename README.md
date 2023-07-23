En main1.js se realiza la operacion utilizando varias queries dentro de transaction.

En main2.js se realiza la operacion utilizando un procedimiento almacenado, el cual se llama dentro de transaction.

#Test

Objetivos:

1. Observar que sucede cuando un procedimiento almacenado falla antes de terminar.
2. Observar que sucede cuando el procedimiento almacenado falla dentro de una transaccion.

En el procedimiento almacenado transfer_test se modifica la cuenta de destino primero.

test1 llama el procedimiento almacenado transfer_test sin usar una transaccion.
test2 llama el procedimiento almacenado transfer_test dentro de transaccion.

Resultados.

1. Cuando un procedimiento almacenado falla, los cambios realizados antes del fallo se mantienen.
2. Cuando un procedimiento almacenado falla dentro de una transaccion, los cambios se deshacen.
