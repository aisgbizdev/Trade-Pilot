//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'outbound_click_stats_by_target_inner.g.dart';

/// OutboundClickStatsByTargetInner
///
/// Properties:
/// * [target] 
/// * [count] 
@BuiltValue()
abstract class OutboundClickStatsByTargetInner implements Built<OutboundClickStatsByTargetInner, OutboundClickStatsByTargetInnerBuilder> {
  @BuiltValueField(wireName: r'target')
  String get target;

  @BuiltValueField(wireName: r'count')
  int get count;

  OutboundClickStatsByTargetInner._();

  factory OutboundClickStatsByTargetInner([void updates(OutboundClickStatsByTargetInnerBuilder b)]) = _$OutboundClickStatsByTargetInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(OutboundClickStatsByTargetInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<OutboundClickStatsByTargetInner> get serializer => _$OutboundClickStatsByTargetInnerSerializer();
}

class _$OutboundClickStatsByTargetInnerSerializer implements PrimitiveSerializer<OutboundClickStatsByTargetInner> {
  @override
  final Iterable<Type> types = const [OutboundClickStatsByTargetInner, _$OutboundClickStatsByTargetInner];

  @override
  final String wireName = r'OutboundClickStatsByTargetInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    OutboundClickStatsByTargetInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'target';
    yield serializers.serialize(
      object.target,
      specifiedType: const FullType(String),
    );
    yield r'count';
    yield serializers.serialize(
      object.count,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    OutboundClickStatsByTargetInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required OutboundClickStatsByTargetInnerBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'target':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.target = valueDes;
          break;
        case r'count':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.count = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  OutboundClickStatsByTargetInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = OutboundClickStatsByTargetInnerBuilder();
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

