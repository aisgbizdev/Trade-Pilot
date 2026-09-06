//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'progression_evidence_start_input_checklist.g.dart';

/// ProgressionEvidenceStartInputChecklist
///
/// Properties:
/// * [instrument] 
/// * [timeframe] 
@BuiltValue()
abstract class ProgressionEvidenceStartInputChecklist implements Built<ProgressionEvidenceStartInputChecklist, ProgressionEvidenceStartInputChecklistBuilder> {
  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'timeframe')
  String get timeframe;

  ProgressionEvidenceStartInputChecklist._();

  factory ProgressionEvidenceStartInputChecklist([void updates(ProgressionEvidenceStartInputChecklistBuilder b)]) = _$ProgressionEvidenceStartInputChecklist;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProgressionEvidenceStartInputChecklistBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProgressionEvidenceStartInputChecklist> get serializer => _$ProgressionEvidenceStartInputChecklistSerializer();
}

class _$ProgressionEvidenceStartInputChecklistSerializer implements PrimitiveSerializer<ProgressionEvidenceStartInputChecklist> {
  @override
  final Iterable<Type> types = const [ProgressionEvidenceStartInputChecklist, _$ProgressionEvidenceStartInputChecklist];

  @override
  final String wireName = r'ProgressionEvidenceStartInputChecklist';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProgressionEvidenceStartInputChecklist object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
    yield r'timeframe';
    yield serializers.serialize(
      object.timeframe,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProgressionEvidenceStartInputChecklist object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProgressionEvidenceStartInputChecklistBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.instrument = valueDes;
          break;
        case r'timeframe':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.timeframe = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProgressionEvidenceStartInputChecklist deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProgressionEvidenceStartInputChecklistBuilder();
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

