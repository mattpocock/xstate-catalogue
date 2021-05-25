import { NextApiHandler } from 'next';
import * as esbuild from 'esbuild';

export interface CompileHandlerResponse {
  didItWork: boolean;
  result?: string;
}

const handler: NextApiHandler<CompileHandlerResponse> = async (req, res) => {
  const fileToCompile = JSON.parse(req.body).file;

  try {
    const transformResult = await esbuild.transform(fileToCompile, {
      sourcefile: 'test.ts',
      loader: 'ts',
    });
    res.json({
      didItWork: true,
      result: transformResult.code,
    });
  } catch (e) {
    console.log(e);
    res.json({
      didItWork: false,
    });
  }
};

export default handler;
