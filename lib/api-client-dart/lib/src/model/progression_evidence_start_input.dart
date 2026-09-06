//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/progression_evidence_start_input_checklist.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'progression_evidence_start_input.g.dart';

/// ProgressionEvidenceStartInput
///
/// Properties:
/// * [source_] 
/// * [guideId] 
/// * [checklist] 
@BuiltValue()
abstract class ProgressionEvidenceStartInput implements Built<ProgressionEvidenceStartInput, ProgressionEvidenceStartInputBuilder> {
  @BuiltValueField(wireName: r'source')
  ProgressionEvidenceStartInputSource_Enum get source_;
  // enum source_Enum {  pre_analysis_checklist,  guide_completion,  };

  @BuiltValueField(wireName: r'guideId')
  ProgressionEvidenceStartInputGuideIdEnum? get guideId;
  // enum guideIdEnum {  how-ai-works,  feature-map,  reading-analysis,  validity-confidence,  adaptive-plan,  personal-progression,  analysis-workflow,  bias-confidence-validity,  levels-chart,  timeframe-risk-map,  technical-fundamental,  standard-plan,  adaptive-position-plan,  account-rules,  terms,  };

  @BuiltValueField(wireName: r'checklist')
  ProgressionEvidenceStartInputChecklist? get checklist;

  ProgressionEvidenceStartInput._();

  factory ProgressionEvidenceStartInput([void updates(ProgressionEvidenceStartInputBuilder b)]) = _$ProgressionEvidenceStartInput;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProgressionEvidenceStartInputBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProgressionEvidenceStartInput> get serializer => _$ProgressionEvidenceStartInputSerializer();
}

class _$ProgressionEvidenceStartInputSerializer implements PrimitiveSerializer<ProgressionEvidenceStartInput> {
  @override
  final Iterable<Type> types = const [ProgressionEvidenceStartInput, _$ProgressionEvidenceStartInput];

  @override
  final String wireName = r'ProgressionEvidenceStartInput';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProgressionEvidenceStartInput object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'source';
    yield serializers.serialize(
      object.source_,
      specifiedType: const FullType(ProgressionEvidenceStartInputSource_Enum),
    );
    if (object.guideId != null) {
      yield r'guideId';
      yield serializers.serialize(
        object.guideId,
        specifiedType: const FullType(ProgressionEvidenceStartInputGuideIdEnum),
      );
    }
    if (object.checklist != null) {
      yield r'checklist';
      yield serializers.serialize(
        object.checklist,
        specifiedType: const FullType(ProgressionEvidenceStartInputChecklist),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    ProgressionEvidenceStartInput object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProgressionEvidenceStartInputBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'source':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(ProgressionEvidenceStartInputSource_Enum),
          ) as ProgressionEvidenceStartInputSource_Enum;
          result.source_ = valueDes;
          break;
        case r'guideId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(ProgressionEvidenceStartInputGuideIdEnum),
          ) as ProgressionEvidenceStartInputGuideIdEnum?;
          if (valueDes == null) continue;
          result.guideId = valueDes;
          break;
        case r'checklist':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(ProgressionEvidenceStartInputChecklist),
          ) as ProgressionEvidenceStartInputChecklist?;
          if (valueDes == null) continue;
          result.checklist.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProgressionEvidenceStartInput deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProgressionEvidenceStartInputBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

class ProgressionEvidenceStartInputSource_Enum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'pre_analysis_checklist')
  static const ProgressionEvidenceStartInputSource_Enum preAnalysisChecklist = _$progressionEvidenceStartInputSourceEnum_preAnalysisChecklist;
  @BuiltValueEnumConst(wireName: r'guide_completion')
  static const ProgressionEvidenceStartInputSource_Enum guideCompletion = _$progressionEvidenceStartInputSourceEnum_guideCompletion;

  static Serializer<ProgressionEvidenceStartInputSource_Enum> get serializer => _$progressionEvidenceStartInputSourceEnumSerializer;

  const ProgressionEvidenceStartInputSource_Enum._(String name): super(name);

  static BuiltSet<ProgressionEvidenceStartInputSource_Enum> get values => _$progressionEvidenceStartInputSourceEnumValues;
  static ProgressionEvidenceStartInputSource_Enum valueOf(String name) => _$progressionEvidenceStartInputSourceEnumValueOf(name);
}

class ProgressionEvidenceStartInputGuideIdEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'how-ai-works')
  static const ProgressionEvidenceStartInputGuideIdEnum howAiWorks = _$progressionEvidenceStartInputGuideIdEnum_howAiWorks;
  @BuiltValueEnumConst(wireName: r'feature-map')
  static const ProgressionEvidenceStartInputGuideIdEnum featureMap = _$progressionEvidenceStartInputGuideIdEnum_featureMap;
  @BuiltValueEnumConst(wireName: r'reading-analysis')
  static const ProgressionEvidenceStartInputGuideIdEnum readingAnalysis = _$progressionEvidenceStartInputGuideIdEnum_readingAnalysis;
  @BuiltValueEnumConst(wireName: r'validity-confidence')
  static const ProgressionEvidenceStartInputGuideIdEnum validityConfidence = _$progressionEvidenceStartInputGuideIdEnum_validityConfidence;
  @BuiltValueEnumConst(wireName: r'adaptive-plan')
  static const ProgressionEvidenceStartInputGuideIdEnum adaptivePlan = _$progressionEvidenceStartInputGuideIdEnum_adaptivePlan;
  @BuiltValueEnumConst(wireName: r'personal-progression')
  static const ProgressionEvidenceStartInputGuideIdEnum personalProgression = _$progressionEvidenceStartInputGuideIdEnum_personalProgression;
  @BuiltValueEnumConst(wireName: r'analysis-workflow')
  static const ProgressionEvidenceStartInputGuideIdEnum analysisWorkflow = _$progressionEvidenceStartInputGuideIdEnum_analysisWorkflow;
  @BuiltValueEnumConst(wireName: r'bias-confidence-validity')
  static const ProgressionEvidenceStartInputGuideIdEnum biasConfidenceValidity = _$progressionEvidenceStartInputGuideIdEnum_biasConfidenceValidity;
  @BuiltValueEnumConst(wireName: r'levels-chart')
  static const ProgressionEvidenceStartInputGuideIdEnum levelsChart = _$progressionEvidenceStartInputGuideIdEnum_levelsChart;
  @BuiltValueEnumConst(wireName: r'timeframe-risk-map')
  static const ProgressionEvidenceStartInputGuideIdEnum timeframeRiskMap = _$progressionEvidenceStartInputGuideIdEnum_timeframeRiskMap;
  @BuiltValueEnumConst(wireName: r'technical-fundamental')
  static const ProgressionEvidenceStartInputGuideIdEnum technicalFundamental = _$progressionEvidenceStartInputGuideIdEnum_technicalFundamental;
  @BuiltValueEnumConst(wireName: r'standard-plan')
  static const ProgressionEvidenceStartInputGuideIdEnum standardPlan = _$progressionEvidenceStartInputGuideIdEnum_standardPlan;
  @BuiltValueEnumConst(wireName: r'adaptive-position-plan')
  static const ProgressionEvidenceStartInputGuideIdEnum adaptivePositionPlan = _$progressionEvidenceStartInputGuideIdEnum_adaptivePositionPlan;
  @BuiltValueEnumConst(wireName: r'account-rules')
  static const ProgressionEvidenceStartInputGuideIdEnum accountRules = _$progressionEvidenceStartInputGuideIdEnum_accountRules;
  @BuiltValueEnumConst(wireName: r'terms')
  static const ProgressionEvidenceStartInputGuideIdEnum terms = _$progressionEvidenceStartInputGuideIdEnum_terms;

  static Serializer<ProgressionEvidenceStartInputGuideIdEnum> get serializer => _$progressionEvidenceStartInputGuideIdEnumSerializer;

  const ProgressionEvidenceStartInputGuideIdEnum._(String name): super(name);

  static BuiltSet<ProgressionEvidenceStartInputGuideIdEnum> get values => _$progressionEvidenceStartInputGuideIdEnumValues;
  static ProgressionEvidenceStartInputGuideIdEnum valueOf(String name) => _$progressionEvidenceStartInputGuideIdEnumValueOf(name);
}

