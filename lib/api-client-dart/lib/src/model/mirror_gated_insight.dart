//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'mirror_gated_insight.g.dart';

/// Wrapper around a trader-mirror insight category. When `gated` is true the cohort was below the minimum sample threshold and `data` is omitted; the UI should render a 'need more data' placeholder.
///
/// Properties:
/// * [gated] 
/// * [reason] 
/// * [need] 
/// * [have] 
/// * [data] 
@BuiltValue()
abstract class MirrorGatedInsight implements Built<MirrorGatedInsight, MirrorGatedInsightBuilder> {
  @BuiltValueField(wireName: r'gated')
  bool get gated;

  @BuiltValueField(wireName: r'reason')
  MirrorGatedInsightReasonEnum? get reason;
  // enum reasonEnum {  need_more_data,  };

  @BuiltValueField(wireName: r'need')
  int? get need;

  @BuiltValueField(wireName: r'have')
  int? get have;

  @BuiltValueField(wireName: r'data')
  BuiltMap<String, JsonObject?>? get data;

  MirrorGatedInsight._();

  factory MirrorGatedInsight([void updates(MirrorGatedInsightBuilder b)]) = _$MirrorGatedInsight;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MirrorGatedInsightBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MirrorGatedInsight> get serializer => _$MirrorGatedInsightSerializer();
}

class _$MirrorGatedInsightSerializer implements PrimitiveSerializer<MirrorGatedInsight> {
  @override
  final Iterable<Type> types = const [MirrorGatedInsight, _$MirrorGatedInsight];

  @override
  final String wireName = r'MirrorGatedInsight';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MirrorGatedInsight object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'gated';
    yield serializers.serialize(
      object.gated,
      specifiedType: const FullType(bool),
    );
    if (object.reason != null) {
      yield r'reason';
      yield serializers.serialize(
        object.reason,
        specifiedType: const FullType(MirrorGatedInsightReasonEnum),
      );
    }
    if (object.need != null) {
      yield r'need';
      yield serializers.serialize(
        object.need,
        specifiedType: const FullType(int),
      );
    }
    if (object.have != null) {
      yield r'have';
      yield serializers.serialize(
        object.have,
        specifiedType: const FullType(int),
      );
    }
    if (object.data != null) {
      yield r'data';
      yield serializers.serialize(
        object.data,
        specifiedType: const FullType(BuiltMap, [FullType(String), FullType.nullable(JsonObject)]),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    MirrorGatedInsight object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MirrorGatedInsightBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'gated':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.gated = valueDes;
          break;
        case r'reason':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(MirrorGatedInsightReasonEnum),
          ) as MirrorGatedInsightReasonEnum?;
          if (valueDes == null) continue;
          result.reason = valueDes;
          break;
        case r'need':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.need = valueDes;
          break;
        case r'have':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.have = valueDes;
          break;
        case r'data':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltMap, [FullType(String), FullType.nullable(JsonObject)]),
          ) as BuiltMap<String, JsonObject?>?;
          if (valueDes == null) continue;
          result.data.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MirrorGatedInsight deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MirrorGatedInsightBuilder();
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

class MirrorGatedInsightReasonEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'need_more_data')
  static const MirrorGatedInsightReasonEnum needMoreData = _$mirrorGatedInsightReasonEnum_needMoreData;

  static Serializer<MirrorGatedInsightReasonEnum> get serializer => _$mirrorGatedInsightReasonEnumSerializer;

  const MirrorGatedInsightReasonEnum._(String name): super(name);

  static BuiltSet<MirrorGatedInsightReasonEnum> get values => _$mirrorGatedInsightReasonEnumValues;
  static MirrorGatedInsightReasonEnum valueOf(String name) => _$mirrorGatedInsightReasonEnumValueOf(name);
}

