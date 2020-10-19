const express = require("express");
const router = express.Router();
const Avaliacao = require("../Avaliacao/Avaliacao");
const Upload = require("../Upload/Upload");

router.get("/historico/:x/:order/:a_d", (req,res) => {
    (async () => {
        /* USAR .POST
        var x = req.body.x;
        var Answer_average_x = 'Answer_average_' + x;
        var order = req.body.order;
        var a_d = req.body.a_d;
        */

        var x = req.params.x;
        var Answer_average_x = 'Answer_average_' + x;
        var order = req.params.order;
        var a_d = req.params.a_d;

        await Avaliacao.findAll({
        attributes: ['id','Cost_center_id', Answer_average_x, 'createdAt' ],
        order: [[order, a_d]]
        //order: [['createdAt', 'DESC']]
        }).then(historico => {
            res.send(             
                historico
                );
            });     
})();

});

router.get("/hist_image/:avaliacaoId/:titulo", (req, res) => {
    (async() =>{
    var avaliacaoId = req.params.avaliacaoId
    var titulo = req.params.titulo
    await Upload.findOne({
        where: {avaliacaoId: avaliacaoId, titulo: titulo}  //Verificando se há a imagem
    }).then(json => {            //A variável json recebe o resultado de .findOne: se encontrar recebe o JSON, caso contrário recebe undefined
        if (json != undefined){ 
            res.send(json.image); 
        }else{
            Upload.findOne({
                where: {avaliacaoId: 1, titulo: 1}
            }).then(json => {            
                    res.send(json.image);}
            )
    }
    })
})();
});

router.get("/avaliacao/:id/:Question_id_answer_S",(req,res) =>{  
    (async () => {    
        var w = {}
        var id = req.params.id;
        var Question_id_answer_S = req.params.Question_id_answer_S;
        await Avaliacao.findOne ({
            where: {id : id}
        }).then(resultado => {
            var notas = resultado.Question_id_answer[Question_id_answer_S].notas
            var justificativas = resultado.Question_id_answer[Question_id_answer_S].justificativas
            w = {notas: notas, justificativas: justificativas}
        }); 
        return res.send(w)
    })();
});

module.exports = router;