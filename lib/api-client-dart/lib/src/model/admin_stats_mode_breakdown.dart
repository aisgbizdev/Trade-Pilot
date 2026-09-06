//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'admin_stats_mode_breakdown.g.dart';

/// AdminStatsModeBreakdown
///
/// Properties:
/// * [beginner] 
/// * [pro] 
@BuiltValue()
abstract class AdminStatsModeBreakdown implements Built<AdminStatsModeBreakdown, AdminStatsModeBreakdownBuilder> {
  @BuiltValueField(wireName: r'beginner')
  int get beginner;

  @BuiltValueField(wireName: r'pro')
  int get pro;

  AdminStatsModeBreakdown._();

  factory AdminStatsModeBreakdown([void updates(AdminStatsModeBreakdownBuilder b)]) = _$AdminStatsModeBreakdown;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AdminStatsModeBreakdownBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AdminStatsModeBreakdown> get serializer => _$AdminStatsModeBreakdownSerializer();
}

class _$AdminStatsModeBreakdownSerializer implements PrimitiveSerializer<AdminStatsModeBreakdown> {
  @override
  final Iterable<Type> types = const [AdminStatsModeBreakdown, _$AdminStatsModeBreakdown];

  @override
  final String wireName = r'AdminStatsModeBreakdown';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AdminStatsModeBreakdown object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'beginner';
    yield serializers.serialize(
      object.beginner,
      specifiedType: const FullType(int),
    );
    yield r'pro';
    yield serializers.serialize(
      object.pro,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AdminStatsModeBreakdown object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AdminStatsModeBreakdownBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'beginner':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.beginner = valueDes;
          break;
        case r'pro':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.pro = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AdminStatsModeBreakdown deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AdminStatsModeBreakdownBuilder();
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

