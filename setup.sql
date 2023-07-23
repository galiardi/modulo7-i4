CREATE DATABASE individual4;

USE individual4;

CREATE TABLE usuarios (
first_name varchar(100),
last_name varchar(100),
email varchar(100) UNIQUE,
saldo DECIMAL CHECK (saldo >= 0)
);

delimiter **
    create procedure transfer_(
        in qty decimal,
        in email_origen varchar(100),
        in email_destino varchar(100)
    )
    begin
    
    set @saldo_origen = (select saldo from usuarios where email=email_origen);
    set @saldo_destino = (select saldo from usuarios where  email=email_destino);
    set @nuevo_saldo_origen = @saldo_origen - qty;
    set @nuevo_saldo_destino = @saldo_destino + qty;

    UPDATE usuarios SET saldo = @nuevo_saldo_origen WHERE email = email_origen;
    UPDATE usuarios SET saldo = @nuevo_saldo_destino WHERE email = email_destino;
    
    end **
delimiter ;

-- Procedimiento almacenado craeado para testear que sucede si un procedimiento falla antes de terminar
-- y no esta dentro de un transaction
delimiter **
    create procedure transfer_test(
        in qty decimal,
        in email_origen varchar(100),
        in email_destino varchar(100)
    )
    begin
    
    set @saldo_origen = (select saldo from usuarios where email=email_origen);
    set @saldo_destino = (select saldo from usuarios where  email=email_destino);
    set @nuevo_saldo_origen = @saldo_origen - qty;
    set @nuevo_saldo_destino = @saldo_destino + qty;

    -- Se ha modificado el destino primero
    UPDATE usuarios SET saldo = @nuevo_saldo_destino WHERE email = email_destino;
    UPDATE usuarios SET saldo = @nuevo_saldo_origen WHERE email = email_origen;
    
    end **
delimiter ;