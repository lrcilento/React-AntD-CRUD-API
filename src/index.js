import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { render } from 'react-dom';
import { PageHeader, Space, Button, Input, Card, List } from 'antd';
import { PlusOutlined, RedoOutlined, UnorderedListOutlined, UserOutlined, LinkOutlined, FileOutlined, SolutionOutlined } from '@ant-design/icons';

function MainPageHeader(props) {
    const routes = [
        {path: 'first', breadcrumbName: 'https://trabalho-react.glitch.me'},
    ]

    return <PageHeader
        style={{border: "1px solid rgb(235, 237, 240)"}}
        onBack={() => null}
        title="Trabalho React"
        breadcrumb={{routes}}
        subTitle="CRUD API Front-End"    
    />
}

function CreateStudent() {
    const [user, setUser] = useState({Username: ''});
    const createStudent = () => {
        axios.post(`https://trabalho-react.glitch.me/aluno`, {"username":user.Username}).then(res => {
            console.log(res)
            console.log(res.data)
            if(res.statusText == "OK") {
                alert('Aluno cadastrado com sucesso!')
            }
            else {
                alert('Falha ao cadastrar aluno!')
            }
        })
    }
    return <div style={{padding: "30px"}}>
        <Space  direction="vertical">
            <Input addonBefore="Username:" value={user.Username} placeholder="Insira o nome de usuário"
                onChange={(e) => setUser({Username: e.target.value})}/>
            <Button type="primary" onClick={createStudent}>Cadastrar</Button>
        </Space>
    </div>
}

function GetStudents() {
    const [students, setStudents] = useState([])
    const getStudents = () => {
        axios.get(`https://trabalho-react.glitch.me/aluno`).then(res => {
            const answer = res.data;
            console.log(res)
            setStudents(answer)
        })
    }
    const clear = () => {
        setStudents([])
    }

    return <div style={{padding: "30px"}}>
        <List style={{paddin: "10px"}}>
            {students.map(student => <List.Item>{student.id}</List.Item>)}
        </List>
        <Space direction="horizontal">
            <Button type="primary" onClick={getStudents}>Listar Todos</Button>
            <Button type="primary" onClick={clear}>Limpar</Button>
        </Space>
    </div>
}

function CreateTask () {
    const [task, setTask] = useState({Title: ''});
    const [newTaskID, setNewTaskID] = useState('')
    const createTask = () => {
        axios.post(`https://trabalho-react.glitch.me/trabalho`, {"titulo":task.Title}).then(res => {
            console.log(res)
            var ID = res.data[res.data.length - 1].id
            if(res.statusText == "OK") {
                alert('Trabalho criado com sucesso!')
            }
            else {
                alert('Falha ao criar trabalho!')
            }
            setNewTaskID(ID)
        })
    }

    return <div style={{padding: "30px"}}>
        <Space  direction="vertical">
            <p>ID do Trabalho: {newTaskID}</p>
            <Input addonBefore="Título:" value={task.Title} placeholder="Insira o título"
                onChange={(e) => setTask({Title: e.target.value})}/>
            <Button type="primary" onClick={createTask}>Criar</Button>
        </Space>
    </div>
}

function GetTasks() {
    const [allTasks, setAllTasks] = useState([])
    const getTasks = () => {
        axios.get(`https://trabalho-react.glitch.me/trabalho`).then(res => {
            const answer = res.data;
            console.log(res)
            setAllTasks(answer)
        })
    }
    const clear = () => {
        setAllTasks([])
    }

    return <div style={{padding: "30px"}}>
        <List style={{paddin: "10px"}}>
            {allTasks.map(task => <List.Item>{task.titulo} - {task.percentual}%</List.Item>)}
        </List>
        <Space direction="horizontal">
            <Button type="primary" onClick={getTasks}>Listar Todos</Button>
            <Button type="primary" onClick={clear}>Limpar</Button>
        </Space>
    </div>
}

function UpdateTask () {
    const [taskID, setTaskID] = useState({ID: ''});
    const [taskProgress, setTaskProgress] = useState({Progress: ''});
    const updateTask = () => {
        var url = "https://trabalho-react.glitch.me/trabalho/percentual/"+taskID.ID+"/"+taskProgress.Progress
        axios.put(url).then(res => {
            console.log(res)
            if(res.statusText == "OK") {
                alert('Percentual atualizado com sucesso!')
            }
            else {
                alert('Falha ao atualizar percentual do trabalho!')
            }
        })
    }
    return <div style={{padding: "30px"}}>
        <Space  direction="vertical">
            <Input addonBefore="ID:" value={taskID.ID} placeholder="Insira o ID do trabalho"
                onChange={(e) => setTaskID({ID: e.target.value})}/>
            <Input addonBefore="Percentual:" value={taskProgress.Title} placeholder="Insira o novo percentual"
                onChange={(e) => setTaskProgress({Progress: e.target.value})}/>
            <Button type="primary" onClick={updateTask}>Atualizar</Button>
        </Space>
    </div>
}

function CreateLink () {
    const [taskID, setTaskID] = useState({ID: ''});
    const [user, setUser] = useState({Username: ''});
    const createLink = () => {
        var url = "https://trabalho-react.glitch.me/alocacao/"+taskID.ID+"/"+user.Username
        axios.put(url).then(res => {
            console.log(res)
            if(res.statusText == "OK") {
                alert('Trabalho alocado com sucesso!')
            }
            else {
                alert('Falha ao alocar trabalho!')
            }
        })
    }
    return <div style={{padding: "30px"}}>
        <Space  direction="vertical">
            <Input addonBefore="ID:" value={taskID.ID} placeholder="Insira o ID do trabalho"
                onChange={(e) => setTaskID({ID: e.target.value})}/>
            <Input addonBefore="Username:" value={user.Username} placeholder="Insira usuário do aluno"
                onChange={(e) => setUser({Username: e.target.value})}/>
            <Button type="primary" onClick={createLink}>Alocar</Button>
        </Space>
    </div>
}

function GetLinks() {
    const [allLinks, setAllLinks] = useState([])
    const getLinks = () => {
        axios.get(`https://trabalho-react.glitch.me/alocacao`).then(res => {
            const answer = res.data;
            console.log(res)
            setAllLinks(answer)
        })
    }
    const clear = () => {
        setAllLinks([])
    }


    return <div style={{padding: "30px"}}>
        <List style={{paddin: "10px"}}>
            {allLinks.map(link => <List.Item>{link.idTrabalho} - {link.idAluno}</List.Item>)}
        </List>
        <Space direction="horizontal">
            <Button type="primary" onClick={getLinks}>Listar Todos</Button>
            <Button type="primary" onClick={clear}>Limpar</Button>
        </Space>
    </div>
}

function GetStudentTasks() {
    const [first, setFirst] = useState(1)
    const [destroy, setDestroy] = useState(0)
    const [allLinks, setAllLinks] = useState([])
    const [studentTasks, setStudentTasks] = useState([])
    const [studentLinks, setStudentLinks] = useState([])
    const [allTasks, setAllTasks] = useState([])
    const [user, setUser] = useState({Username: ''});
    const getStudentTasks = () => {
        axios.get(`https://trabalho-react.glitch.me/alocacao`).then(res => {
            const answer = res.data;
            console.log(res)
            setAllLinks(answer)
            allLinks.forEach(check)
            axios.get(`https://trabalho-react.glitch.me/trabalho`).then(res => {
                const answer = res.data;
                console.log(res)
                setAllTasks(answer)
                allTasks.forEach(check)
            })
        })
        if (first == 1) {
            setFirst(0)
        }
        else {
            setDestroy(1)
        }
    }
    const clear = () => {
        setStudentTasks([])
        setStudentLinks([])
        setUser('')
        setDestroy(0)
    }
    const check = (item) => {
        if (item.idAluno == user.Username) {
            studentLinks.push(item.idTrabalho)
        }
        if (studentLinks.includes(item.id)) {
            studentTasks.push(item)
            setUser('')
        }
    }
    
    return <div style={{padding: "30px"}}>
        <Space  direction="vertical">
            <List style={{paddin: "10px"}}>
                {studentTasks.map(task => <List.Item>{task.titulo} - {task.percentual}%</List.Item>)}
            </List>
            <Input addonBefore="Username:" value={user.Username} placeholder="Insira seu nome de usuário"
                onChange={(e) => setUser({Username: e.target.value})}/>
            <Space direction="horizontal">
                <Button type="primary" disabled={destroy == 1 ? true : false} onClick={getStudentTasks}>Listar Todos</Button>
                <Button type="primary" onClick={clear}>Limpar</Button>
            </Space>
        </Space>
    </div>
}

function MainSpace() {

    return <Space direction="horizontal" style={{width: "100%", padding: "30px"}} align="start">
        <Space direction="vertical" style={{padding: "30px"}}>
            <Card title="Alunos" extra={<UserOutlined/>}>
                <Card title="Cadastrar" extra={<PlusOutlined/>}>
                    <CreateStudent/>
                </Card>
                <Card title="Listar" extra={<UnorderedListOutlined/>}>
                    <GetStudents/>
                </Card>
                <Card title="Listar seus Trabalhos" extra={<SolutionOutlined/>}>
                    <GetStudentTasks/>
                </Card>
            </Card>
        </Space>
        <Space direction="vertical" style={{padding: "30px"}}>
            <Card title="Trabalhos" extra={<FileOutlined/>}>
                <Card title="Criar" extra={<PlusOutlined/>}>
                    <CreateTask/>
                </Card>
                <Card title="Listar" extra={<UnorderedListOutlined/>}>
                    <GetTasks/>
                </Card>
                <Card title="Atualizar" extra={<RedoOutlined/>}>
                    <UpdateTask/>
                </Card>
            </Card>
        </Space>
                <Space direction="vertical" style={{padding: "30px"}}>
            <Card title="Alocações" extra={<LinkOutlined/>}>
                <Card title="Alocar" extra={<PlusOutlined/>}>
                    <CreateLink/>
                </Card>
                <Card title="Listar" extra={<UnorderedListOutlined/>}>
                    <GetLinks/>
                </Card>
            </Card>
        </Space>
    </Space>
}

render(<div>
    <MainPageHeader/>
    <MainSpace/>
</div>, document.getElementById('root'));