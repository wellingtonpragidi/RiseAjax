<?php
if( $_SERVER['REQUEST_METHOD'] === 'POST' ) :

	$data = [ 'name' => $_POST['name'], 'date' => $_POST['date'] ];

    /** 
     * cria um arquivo data-rise.json 
     * exemplo do conteudo
     {
        "name": "Charlaine Alves",
        "date": "2023-09-05"
    }
    */
    if( file_put_contents('data-rise.json', json_encode($data, JSON_PRETTY_PRINT)) ) {
    	echo json_encode([
    		'text' => '<p>Texto atualizado</p>',
    		'name' => '<p>Nome: ' . $_POST['name'] . '</p>',
    		'date' => '<p>Date: ' . $_POST['date'] . '</p>'
    	]);
    }
    else {
    	echo json_encode([
    		'text' => '<p>Arquivo data-rise.json não atualizado</p>'
    	]);
    }
    exit;

endif;
