<?php

/* @ongea_theme/components/slider-box.html.twig */
class __TwigTemplate_5b3ff4a932baf874bf0bddd9e837ca0a06091577cd64cbc512351c206ea314dd extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $tags = array("if" => 3, "set" => 5);
        $filters = array("length" => 13, "t" => 40);
        $functions = array("path" => 5);

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('if', 'set'),
                array('length', 't'),
                array('path')
            );
        } catch (Twig_Sandbox_SecurityError $e) {
            $e->setSourceContext($this->getSourceContext());

            if ($e instanceof Twig_Sandbox_SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

        // line 1
        echo "
";
        // line 3
        if ( !(null === ($context["slider_content"] ?? null))) {
            // line 4
            echo "    ";
            if ( !(null === $this->getAttribute(($context["slider_content"] ?? null), "nid", array()))) {
                // line 5
                echo "        ";
                $context["url"] = $this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("entity.node.canonical", array("node" => $this->getAttribute(($context["slider_content"] ?? null), "nid", array())));
                // line 6
                echo "    ";
            }
            // line 7
            echo "    <div class=\"slider-content\">
        <a href=\"";
            // line 8
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["url"] ?? null), "html", null, true));
            echo "\">
            <div class=\"image-container\" style=\"background: #323232 url('";
            // line 9
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["slider_content"] ?? null), "image", array()), "url", array()), "html", null, true));
            echo "') no-repeat center; background-size: cover;\"></div>
        </a>
        <div class=\"slider-text\">
            <div class=\"row text-content\">
                ";
            // line 13
            if ((twig_length_filter($this->env, $this->getAttribute(($context["slider_content"] ?? null), "title", array())) > 0)) {
                // line 14
                echo "                    <h4 class=\"slider-title text-center\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["slider_content"] ?? null), "title", array()), "html", null, true));
                echo "</h4>
                ";
            }
            // line 16
            echo "
                ";
            // line 17
            if ($this->getAttribute(($context["slider_content"] ?? null), "show_name", array())) {
                echo " 
                        ";
                // line 18
                if ((twig_length_filter($this->env, $this->getAttribute(($context["slider_content"] ?? null), "nickname", array())) > 0)) {
                    // line 19
                    echo "                            <h4 class=\"slider-title text-center\"><i>\"";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["slider_content"] ?? null), "nickname", array()), "html", null, true));
                    echo "\"</i></h4>
                        ";
                }
                // line 21
                echo "                ";
            } else {
                // line 22
                echo "                    ";
                if ((twig_length_filter($this->env, $this->getAttribute(($context["slider_content"] ?? null), "first_name", array())) > 0)) {
                    // line 23
                    echo "                        <h4 class=\"slider-title text-center\">";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["slider_content"] ?? null), "first_name", array()), "html", null, true));
                    echo " ";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["slider_content"] ?? null), "last_name", array()), "html", null, true));
                    echo "</h4>
                        ";
                    // line 24
                    if ((twig_length_filter($this->env, $this->getAttribute(($context["slider_content"] ?? null), "nickname", array())) > 0)) {
                        // line 25
                        echo "                            <p class=\"text-center\"><i>\"";
                        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["slider_content"] ?? null), "nickname", array()), "html", null, true));
                        echo "\"</i></p>
                        ";
                    }
                    // line 27
                    echo "                    ";
                } else {
                    // line 28
                    echo "                        ";
                    if ((twig_length_filter($this->env, $this->getAttribute(($context["slider_content"] ?? null), "nickname", array())) > 0)) {
                        // line 29
                        echo "                            <h4 class=\"slider-title text-center\"><i>\"";
                        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["slider_content"] ?? null), "nickname", array()), "html", null, true));
                        echo "\"</i></h4>
                        ";
                    }
                    // line 31
                    echo "                    ";
                }
                // line 32
                echo "                ";
            }
            // line 33
            echo "
                <div class=\"flex-prevent\">
                    <div class=\"half\">
                        <p class=\"text-bold text-upper\">";
            // line 36
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["slider_content"] ?? null), "name", array()), "html", null, true));
            echo "</p>
                    </div>
                    <div class=\"half\">
                        ";
            // line 39
            if (($context["url"] ?? null)) {
                // line 40
                echo "                            <a class=\"-link\" href=\"";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["url"] ?? null), "html", null, true));
                echo "\"><p class=\"text-right -text\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Read More")));
                echo "</p></a>
                        ";
            }
            // line 42
            echo "                    </div>
                </div>
            </div>
        </div>
    </div>
";
        }
    }

    public function getTemplateName()
    {
        return "@ongea_theme/components/slider-box.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  154 => 42,  146 => 40,  144 => 39,  138 => 36,  133 => 33,  130 => 32,  127 => 31,  121 => 29,  118 => 28,  115 => 27,  109 => 25,  107 => 24,  100 => 23,  97 => 22,  94 => 21,  88 => 19,  86 => 18,  82 => 17,  79 => 16,  73 => 14,  71 => 13,  64 => 9,  60 => 8,  57 => 7,  54 => 6,  51 => 5,  48 => 4,  46 => 3,  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "@ongea_theme/components/slider-box.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/components/slider-box.html.twig");
    }
}
