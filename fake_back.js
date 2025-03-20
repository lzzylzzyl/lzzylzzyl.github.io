// Express´úÂëÖ´ÐÐ¶Ëµã
app.post('/api/execute', async (req, res) => {
    const { code, lang } = req.body;
    const result = await codeRunner.execute(lang, code);
    res.json({
        output: result.stdout,
        metrics: {
            time: result.time,
            memory: result.memory,
            cyclomatic: analyzeComplexity(code)
        }
    });
});