const express = require('express') 
const routes = express.Router()
//route for select
routes.get("/:table",(req,res)=>{

    req.getConnection((err,conn)=>{
        
        if (err) return res.send(err) // si existe un error retornarlo

        var ssql= 'SELECT * FROM ' + req.params.table
        if(req.params.table=="marcadores") ssql += ' ORDER BY mar_fechaevento desc, mar_horaevento desc;'
        conn.query(ssql,(err,rows)=>{
            if (err) return res.send(err)

            res.json(rows)
        })

    })
})
//route for insert
routes.post("/:table",(req,res)=>{
    req.getConnection((err,conn)=>{
        if (err) return res.send(err) // si existe un error retornarlo

        var ssql= 'ALTER TABLE '+ req.params.table +' AUTO_INCREMENT = 1 ;'
        conn.query(ssql,[req.body],(err,rows)=>{
            if (err) return res.send(err)
            ssql = 'INSERT INTO ' + req.params.table +' SET ?'
            conn.query(ssql,[req.body],(err,rows)=>{
                if (err) return res.send(err)
                res.json('Added!')
            })
        })
        
        

    })
})
//route for delete
routes.delete("/:table/:field/:id",(req,res)=>{
    
    req.getConnection((err,conn)=>{
        
        if (err) return res.send(err) // si existe un error retornarlo

        var ssql= 'DELETE FROM '+ req.params.table +' WHERE '+req.params.field+' = ?'
        conn.query(ssql,[req.params.id],(err,rows)=>{
            if (err) return res.send(err)

            res.json('Deleted!')
        })

    })
})
//route for update
routes.put("/:table/:field/:id",(req,res)=>{
    
    req.getConnection((err,conn)=>{
        
        if (err) return res.send(err) // si existe un error retornarlo

        var ssql= 'UPDATE '+ req.params.table +' set ? WHERE '+ req.params.field +' = ?'
        conn.query(ssql,[req.body,req.params.id],(err,rows)=>{
            if (err) return res.send(err)

            res.status(201).json('Updated!')
        })

    })
})

//ruta para listar registro con limite
routes.get('/:table/:lim',(req,res)=> {
    
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)

        var ssql = "SELECT t1.mar_id AS sec, t1.mar_fechaevento AS fecha,"
        ssql += "t2.equi_nombre AS equi1, t2.equi_logo AS equi1_logo, t3.equi_nombre AS equi2, t3.equi_logo AS equi2_logo,"
        ssql += "t1.mar_marcadorequi1 AS marca1, t1.mar_marcadorequi2 AS marca2,"
        ssql += "t4.dep_nombre AS deporte,"
        ssql += "t1.mar_descrip as descrip "
        ssql += "FROM marcadores AS t1 "
        ssql += "LEFT JOIN equipos AS t2 ON t1.equi_id1=t2.equi_id "
        ssql += "LEFT JOIN equipos AS t3 ON t1.equi_id2=t3.equi_id "
        ssql += "LEFT JOIN deportes AS t4 ON t1.dep_id=t4.dep_id "
        ssql += "ORDER BY fecha desc LIMIT " + req.params.lim

        conn.query(ssql,(err,rows)=>{
        if (err) return res.send(err)
            res.json(rows)
        })
    })
})

//ruta para listar registro con limite y con deporte
routes.get('/eventos/:dep_nombre/:lim',(req,res)=> {
    
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)

        var ssql = "SELECT t1.mar_id AS sec, t1.mar_fechaevento AS fecha,"
        ssql += "t2.equi_nombre AS equi1, t2.equi_logo AS equi1_logo, t3.equi_nombre AS equi2, t3.equi_logo AS equi2_logo,"
        ssql += "t1.mar_marcadorequi1 AS marca1, t1.mar_marcadorequi2 AS marca2,"
        ssql += "t4.dep_nombre AS deporte,"
        ssql += "t1.mar_descrip as descrip "
        ssql += "FROM marcadores AS t1 "
        ssql += "LEFT JOIN equipos AS t2 ON t1.equi_id1=t2.equi_id "
        ssql += "LEFT JOIN equipos AS t3 ON t1.equi_id2=t3.equi_id "
        ssql += "LEFT JOIN deportes AS t4 ON t1.dep_id=t4.dep_id "
        ssql += 'WHERE t4.dep_nombre ="'+req.params.dep_nombre+'"'
        ssql += "ORDER BY fecha desc LIMIT " + req.params.lim

        conn.query(ssql,(err,rows)=>{
        if (err) return res.send(err)
            res.json(rows)
        })
    })
})

//ruta para inicio de sesión

routes.get('/:table/:email/:clave',(req,res)=>{
    req.getConnection((err,conn)=>{
        if (err) return res.send(err)

        var ssql = 'SELECT * FROM '+req.params.table+' WHERE usu_email="'+req.params.email+'" AND usu_clave="'+req.params.clave+'"'
        conn.query(ssql,(err,rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

module.exports=routes //exportar la variable que necesito