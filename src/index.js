import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { render } from 'react-dom';
import { PageHeader, Space, Button, Input, Card, List, Progress, Radio, Checkbox, Modal, Slider, Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, FileOutlined } from '@ant-design/icons';

var loggedUser = 'Identificação'

function MainPageHeader() {
    return <PageHeader
        style={{border: "1px solid rgb(235, 237, 240)"}}
        backIcon={<HomeOutlined/>}
        onBack={() => {
            loggedUser = 'Identificação'
            renderPage()
        }}
        title="Trabalho React"
        subTitle="CRUD API em React e Ant Design"
    />
}

function CheckUser() {
    const [user, setUser] = useState({Username: ''});
    const createUser = () => {
        if (user.Username != '') {
            axios.post(`https://trabalho-react.glitch.me/aluno`, {"username":user.Username}).then(res => {
                if(res.data.erro == true) {
                    Modal.success({content: 'Login efetuado com sucesso!'})
                }
                else {
                    Modal.success({content: 'Usuário cadastrado com sucesso!'})
                }
                loggedUser = user.Username
                renderPage()
            })
        }
    }

    return <Space direction="horizontal" style={{width: "100%", padding: "30px"}}>
        <Space direction="vertical" style={{padding: "30px"}}>
            <Card title="Identificação" extra={<UserOutlined/>}>
                <div style={{padding: "30px"}}>
                    <Space  direction="vertical">
                        <Input addonBefore="Username:" value={user.Username} placeholder="Insira o nome de usuário"
                            onChange={(e) => setUser({Username: e.target.value})}/>
                        <Button type="primary" onClick={createUser}>Acessar</Button>
                    </Space>
                </div>
            </Card>
        </Space>
    </Space>
}

function TaskManager() {
    const [selectedTask, setSelectedTask] = useState({Id: '', Percentual: 0})
    const [visible, setVisible] = useState({new: false, progress: false});
    const [showID, setShowID] = useState(false)
    const [all, setAll] = useState(true)
    const [requestedTasks, setRequestedTasks] = useState([])
    const [requestedPendentTasks, setRequestedPendentTasks] = useState([])
    const [user, setUser] = useState({Username: loggedUser})
    const [task, setTask] = useState({Title: ''})

    var allLinks = []
    var allTasks = []
    var studentLinks = []
    var studentTasks = []
    var studentPendentTasks = []

    const selected = (e) => {
        setSelectedTask({Id:e.target.id.substring(0, 16), Percentual:Number(e.target.id.substring(17, e.target.id.length))})
        if(selectedTask.Id != '') {
            setVisible({progress:true})
        }
    }

    const updatePercentual = (val) => {
        setSelectedTask({Id:selectedTask.Id, Percentual:val});
    }

    const handleProgressOK = () => {
        var url = "https://trabalho-react.glitch.me/trabalho/percentual/"+selectedTask.Id+"/"+selectedTask.Percentual
        axios.put(url).then(res => {
            if(res.statusText == "OK") {
                Modal.success({content: 'Percentual atualizado com sucesso!'})
            }
            else {
                Modal.success({content: 'Falha ao atualizar percentual do trabalho!'})
            }
        }).then(res => {
            getStudentTasks()
            setVisible({progress:false})
        })
    }

    const handleProgressCancel = () => {
        setVisible({progress:false})
    }

    const showNewModal = () => {
        setVisible({new:true})
    }

    const handleNewOK = e => {
        axios.post(`https://trabalho-react.glitch.me/trabalho`, {"titulo":task.Title}).then(res => {
            var ID = res.data[res.data.length - 1].id
            if(res.statusText == "OK") {
                var url = "https://trabalho-react.glitch.me/alocacao/"+ID+"/"+loggedUser
                axios.put(url).then(res => {
                    if(res.statusText == "OK") {
                        Modal.success({content: 'Trabalho criado com sucesso!\nID: '+ID})
                    }
                    else {
                        Modal.success({content: 'Falha ao criar trabalho!'})
                    }
                }).then(res => {
                    getStudentTasks()
                })
            }
            else {
                Modal.success({content: 'Falha ao criar trabalho!'})
            }
        })
        setVisible({new:false})
    }

    const handleNewCancel = e => {
        setVisible({new:false})
    }

    const getStudentTasks = () => {
        axios.all([
            axios.get(`https://trabalho-react.glitch.me/alocacao`),
            axios.get(`https://trabalho-react.glitch.me/trabalho`)
        ]).then(axios.spread((res1, res2) => {
            const answer1 = res1.data;
            allLinks = answer1
            allLinks.forEach(check)
            const answer2 = res2.data;
            allTasks = answer2
            allTasks.forEach(check)
            setRequestedTasks(studentTasks)
            setRequestedPendentTasks(studentPendentTasks)
            studentLinks = []
            studentTasks = []
            studentPendentTasks = []
        }))
    }

    const check = (item) => {
        if (item.idAluno == user.Username) {
            studentLinks.push(item.idTrabalho)
        }
        if (studentLinks.includes(item.id)) {
            studentTasks.push(item)
        }
        if (studentLinks.includes(item.id) && item.percentual < 100) {
            studentPendentTasks.push(item)
        }
    }

    function RequestedList() {

        if(all) {
            if(showID) {
                return <List style={{width: 460, padding: "10px"}}>
                    {requestedTasks.map(task => <List.Item  key={task.id} id={[task.id, task.percentual]} onClick={selected}>{task.titulo} ({task.id})<Progress percent={Number(task.percentual)}/></List.Item>)}
                </List>
            }
            else {
                return <List style={{width: 460, padding: "10px"}}>
                    {requestedTasks.map(task => <List.Item  key={task.id} id={[task.id, task.percentual]} onClick={selected}>{task.titulo}<Progress percent={Number(task.percentual)}/></List.Item>)}
                </List>
            }
        }
        else {
            if(showID) {
                return <List style={{width: 460, padding: "10px"}}>
                    {requestedPendentTasks.map(task => <List.Item  key={task.id} id={[task.id, task.percentual]} onClick={selected}>{task.titulo} ({task.id})<Progress percent={Number(task.percentual)}/></List.Item>)}
                </List>
            }
            else {
                return <List style={{width: 460, padding: "10px"}}>
                    {requestedPendentTasks.map(task => <List.Item  key={task.id} id={[task.id, task.percentual]} onClick={selected}>{task.titulo}<Progress percent={Number(task.percentual)}/></List.Item>)}
                </List>
            }
        }
    }

    return <div style={{padding: "10px"}}>
        <Space  direction="vertical" align="start">
            <Card title="Seus Trabalhos" extra={<FileOutlined/>}>
                <Space  direction="vertical" align="start">
                    <RequestedList/>
                    <Space direction="horizontal" style={{padding: "10px"}}>
                        <Radio.Group onChange={(e) => setAll(e.target.value)} value={all}>
                            <Radio value={true}>Todos</Radio>
                            <Radio value={false}>Pendentes</Radio>
                        </Radio.Group>
                        <Checkbox onChange={(e) => setShowID(e.target.checked)}>Mostrar IDs</Checkbox>
                        <Button type="primary" onClick={getStudentTasks}>Listar</Button>
                        <Button type="primary" onClick={showNewModal}>Novo</Button>
                    </Space>
                    <Modal title="Novo Trabalho" visible={visible.new} onOk={handleNewOK} onCancel={handleNewCancel}>
                        <Input addonBefore="Título:" value={task.Title} placeholder="Insira o título"
                            onChange={(e) => setTask({Title: e.target.value})}/>
                    </Modal>
                    <Modal title="Atualizar Progresso" visible={visible.progress} onOk={handleProgressOK} onCancel={handleProgressCancel}>
                        <Slider min={0} max={100} onChange={updatePercentual} value={selectedTask.Percentual}/>
                        <Progress percent={selectedTask.Percentual}/>
                    </Modal>
                </Space>
            </Card>
        </Space>
    </div>
}

function Dashboard() {

    return <Space direction="horizontal" style={{width: "100%", padding: "30px"}}>
        <Space direction="vertical" style={{padding: "10px"}}>
            <Card title={'Bem vindo, '+loggedUser+'!'} extra={<UserOutlined/>}>
                <Space direction="horizontal" style={{width: "100%", padding: "10px"}}>
                    <TaskManager/>
                </Space>
            </Card>
        </Space>
    </Space>
}

function renderPage() {

    if (loggedUser == 'Identificação') {
        render(<div>
            <MainPageHeader/>
            <div style={{width: '30%', margin: '0 auto'}}>
                <CheckUser/>
            </div>
        </div>, document.getElementById('root'));
    }
    else {
        render(<div>
            <MainPageHeader/>
            <div style={{width: '40%', margin: '0 auto'}}>
                <Dashboard/>
            </div>
        </div>, document.getElementById('root'));
    }
}

renderPage()