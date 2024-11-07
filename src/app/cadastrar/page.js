"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormLabel, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { useState, useEffect } from "react";
import axios from "../../lib/axios"
import { rooms } from "./complete_rooms";

export default function Cadastrar() {

    const form = useForm({
        defaultValues: {
            quantidadeAlunos: 1,
            idSala: '',
            alunos: []
        }
    });

    const { handleSubmit, register, watch, formState: { errors }, setValue } = form;
    const [numAlunos, setNumAlunos] = useState(1);

    // Monitora o valor de "Quantidade de Alunos" e ajusta a quantidade de inputs dinamicamente
    const quantidadeAlunos = watch("quantidadeAlunos");

    const handleQuantidadeAlunosChange = (e) => {
        const quantidade = Number(e.target.value);
        setNumAlunos(quantidade);
    };

    useEffect(() => {
        // Extrai os parâmetros da URL, se presentes
        const params = new URLSearchParams(window.location.search);
        const salaParam = params.get('sala'); // ex: ?sala=1B
        console.log("ROOMS", rooms)
        if(salaParam && rooms[salaParam]){
            const salaData = rooms[salaParam]
            setNumAlunos(salaData.quantidadeAlunos)
            setValue('quantidadeAlunos', salaData.quantidadeAlunos)
            setValue("alunos", salaData.alunos)
        }
    }, [setValue]);


    const onSubmit = async (data) => {
        console.log("Data", data);
        try {
            // Filtra alunos com campos preenchidos
            const alunosPreenchidos = data.alunos.filter(
                (aluno) => aluno.usuario && aluno.nome && aluno.sobrenome
            );
    
            // Itera sobre cada aluno preenchido e executa as requisições em sequência
            for (const aluno of alunosPreenchidos) {
                // Cria o payload e formData para a requisição de criação de usuário
                const formData = new FormData();
                const payload = {
                    email: `${aluno.nome}_${aluno.sobrenome}@gmail.com`,
                    first_name: aluno.nome,
                    last_name: aluno.sobrenome,
                    password: '123senha123', // Defina a senha padrão
                    type: 2, // Tipo de usuário "Estudante"
                    username: aluno.usuario,
                };
                formData.append('user', JSON.stringify(payload));
    
                // Faz a requisição para criar o usuário
                const response = await axios.post(`/users/`, formData);
                const userId = response.data.id;  // Extrai o `id` do usuário criado
                console.log(`Usuário criado com ID: ${userId}`);
    
                // Faz a segunda requisição para adicionar o usuário à sala
                await axios.post(`/classroom/${data.idSala}/students/?user_id=${userId}`);
                console.log(`Usuário com ID: ${userId} adicionado à sala ${data.idSala}`);
            }
    
            console.log("Todos os usuários foram adicionados à sala com sucesso.");
    
            // Reseta o formulário após todas as requisições serem bem-sucedidas
            form.reset();
    
        } catch (error) {
            console.error('Erro ao criar usuários ou adicionar à sala:', error);
        }
    };

    return (
        <Card className="w-[1056px] h-[750px] overflow-hidden bg-indigo-200 border-0 drop-shadow-xl">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Cadastro de Alunos</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center p-6 space-y-6">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Linha para definir quantidade de alunos e ID da sala */}
                        <div className="flex space-x-4 w-full">
                            <FormItem className="flex-1">
                                <FormLabel>Quantidade de Alunos</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Digite a quantidade"
                                        {...register("quantidadeAlunos", { valueAsNumber: true })}
                                        onChange={handleQuantidadeAlunosChange}
                                    />
                                </FormControl>
                                <FormMessage>{errors.quantidadeAlunos?.message}</FormMessage>
                            </FormItem>

                            <FormItem className="flex-1">
                                <FormLabel>ID da Sala</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite o ID da sala" {...register("idSala")} />
                                </FormControl>
                                <FormMessage>{errors.idSala?.message}</FormMessage>
                            </FormItem>
                        </div>

                        {/* Renderiza os campos de aluno dinamicamente */}
                        <div className="max-h-[450px] overflow-y-auto space-y-4 w-full p-6">
                            {Array.from({ length: numAlunos }).map((_, index) => (
                                <div key={index} className="flex space-x-4 w-full">
                                    <FormItem className="flex-1">
                                        <FormLabel>Usuário {index + 1}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Digite o usuário"
                                                {...register(`alunos[${index}].usuario`)}
                                                required
                                            />
                                        </FormControl>
                                        <FormMessage>{errors?.alunos?.[index]?.usuario?.message}</FormMessage>
                                    </FormItem>

                                    <FormItem className="flex-1">
                                        <FormLabel>Nome {index + 1}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Digite o nome"
                                                {...register(`alunos[${index}].nome`)}
                                                required
                                            />
                                        </FormControl>
                                        <FormMessage>{errors?.alunos?.[index]?.nome?.message}</FormMessage>
                                    </FormItem>

                                    <FormItem className="flex-1">
                                        <FormLabel>Sobrenome {index + 1}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Digite o sobrenome"
                                                {...register(`alunos[${index}].sobrenome`)}
                                                required
                                            />
                                        </FormControl>
                                        <FormMessage>{errors?.alunos?.[index]?.sobrenome?.message}</FormMessage>
                                    </FormItem>
                                </div>
                            ))}
                        </div>

                        {/* Botão de confirmar */}
                        <div className="flex justify-center w-full pt-4">
                            <Button className="w-52" type="submit">
                                Confirmar
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
